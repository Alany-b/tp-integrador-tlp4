import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  changeEventStatus,
  deleteEvent,
  getEvent,
  subscribeToEvent,
  unsubscribeFromEvent,
} from "../api/events.api";
import { ApiError } from "../api/client";
import { Can } from "../components/Can";
import { EVENT_STATUSES } from "../types";
import type { EventDetail, EventStatus } from "../types";

function getBadgeClassName(status: EventStatus): string {
  if (status === "PROGRAMADO") {
    return "badge badge--programado";
  }
  if (status === "REPROGRAMADO") {
    return "badge badge--reprogramado";
  }
  if (status === "FINALIZADO") {
    return "badge badge--finalizado";
  }
  return "badge badge--cancelado";
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date
    .toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");
}

function getErrorMessage(caught: unknown): string {
  if (caught instanceof ApiError) {
    return caught.message;
  }
  return "Ocurrió un error inesperado.";
}

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [statusSelection, setStatusSelection] = useState<EventStatus>("PROGRAMADO");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");

  async function loadEvent(): Promise<void> {
    if (id === undefined) {
      setError("El evento solicitado no existe.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await getEvent(id);
      setEvent(data);
      setStatusSelection(data.status);
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvent();
  }, [id]);

  async function handleSubscribe(submitEvent: FormEvent<HTMLFormElement>): Promise<void> {
    submitEvent.preventDefault();
    if (event === null) {
      return;
    }
    setActionError("");
    try {
      await subscribeToEvent(event.id);
      setEvent({ ...event, isSubscribed: true });
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  }

  async function handleUnsubscribe(submitEvent: FormEvent<HTMLFormElement>): Promise<void> {
    submitEvent.preventDefault();
    if (event === null) {
      return;
    }
    setActionError("");
    try {
      await unsubscribeFromEvent(event.id);
      setEvent({ ...event, isSubscribed: false });
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  }

  async function handleChangeStatus(submitEvent: FormEvent<HTMLFormElement>): Promise<void> {
    submitEvent.preventDefault();
    if (event === null) {
      return;
    }
    setActionError("");
    try {
      const updated = await changeEventStatus(event.id, { status: statusSelection });
      setEvent({ ...event, status: updated.status, updatedAt: updated.updatedAt });
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  }

  async function handleDelete(): Promise<void> {
    if (event === null) {
      return;
    }
    const confirmed = window.confirm("¿Seguro que querés eliminar este evento?");
    if (!confirmed) {
      return;
    }
    setActionError("");
    try {
      await deleteEvent(event.id);
      navigate("/events");
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  }

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">{event !== null ? `Evento #${event.id}` : "Detalle del evento"}</h1>
        <div className="page__actions">
          <Link className="btn btn--secondary" to="/events">
            Volver al listado
          </Link>
        </div>
      </header>

      {loading && (
        <div className="state state--loading" role="status">
          <div className="state__spinner"></div>
          <p className="state__title">Cargando evento</p>
          <p className="state__text">Esto puede demorar unos segundos.</p>
        </div>
      )}

      {!loading && error !== "" && (
        <div className="state state--error" role="alert">
          <p className="state__title">No se pudo cargar el evento</p>
          <p className="state__text">{error}</p>
          <div className="state__actions">
            <button className="btn btn--secondary btn--small" type="button" onClick={loadEvent}>
              Reintentar
            </button>
          </div>
        </div>
      )}

      {!loading && error === "" && event !== null && (
        <article className="card event-detail">
          <div className="event-detail__header">
            <h2>{event.title}</h2>
            <span className={getBadgeClassName(event.status)}>{event.status}</span>
          </div>
          <dl className="event-detail__meta">
            <div>
              <dt className="event-detail__term">Fecha del evento</dt>
              <dd className="event-detail__value">
                <time dateTime={event.eventDate}>{formatDate(event.eventDate)}</time>
              </dd>
            </div>
            <div>
              <dt className="event-detail__term">Creado</dt>
              <dd className="event-detail__value">
                <time dateTime={event.createdAt}>{formatDate(event.createdAt)}</time>
              </dd>
            </div>
            <div>
              <dt className="event-detail__term">Actualizado</dt>
              <dd className="event-detail__value">
                <time dateTime={event.updatedAt}>{formatDate(event.updatedAt)}</time>
              </dd>
            </div>
          </dl>
          <p className="event-detail__description">{event.description}</p>
          {actionError !== "" && (
            <p className="form__error" role="alert">
              {actionError}
            </p>
          )}
          <div className="event-detail__actions">
            <div className="event-detail__group">
              {!event.isSubscribed && (
                <Can permission="subscription:create">
                  <form onSubmit={handleSubscribe}>
                    <button className="btn btn--primary" type="submit">
                      Suscribirse
                    </button>
                  </form>
                </Can>
              )}
              {event.isSubscribed && (
                <Can permission="subscription:delete">
                  <form onSubmit={handleUnsubscribe}>
                    <button className="btn btn--secondary" type="submit">
                      Desuscribirse
                    </button>
                  </form>
                </Can>
              )}
            </div>
            <Can permission="event:change-status">
              <form className="event-detail__group" onSubmit={handleChangeStatus}>
                <fieldset className="event-detail__group">
                  <legend className="visually-hidden">Cambiar estado</legend>
                  <label className="form__label" htmlFor="event-status">
                    Estado
                  </label>
                  <select
                    className="form__select form__select--inline"
                    id="event-status"
                    name="status"
                    value={statusSelection}
                    onChange={(event) => {
                      const selected = EVENT_STATUSES.find((status) => status === event.target.value);
                      if (selected !== undefined) {
                        setStatusSelection(selected);
                      }
                    }}
                  >
                    {EVENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn--secondary" type="submit">
                    Aplicar estado
                  </button>
                </fieldset>
              </form>
            </Can>
            <div className="event-detail__group">
              <Can permission="event:update">
                <Link className="btn btn--secondary" to={`/events/${event.id}/edit`}>
                  Editar
                </Link>
              </Can>
              <Can permission="event:delete">
                <button className="btn btn--danger" type="button" onClick={handleDelete}>
                  Eliminar
                </button>
              </Can>
            </div>
          </div>
        </article>
      )}
    </main>
  );
}
