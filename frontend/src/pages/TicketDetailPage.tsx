import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  changeTicketStatus,
  deleteTicket,
  getTicket,
  subscribeToTicket,
  unsubscribeFromTicket,
} from "../api/tickets.api";
import { ApiError } from "../api/client";
import { Can } from "../components/Can";
import { TICKET_STATUSES } from "../types";
import type { TicketDetail, TicketStatus } from "../types";

function getBadgeClassName(status: TicketStatus): string {
  if (status === "ABIERTO") {
    return "badge badge--abierto";
  }
  if (status === "EN_PROGRESO") {
    return "badge badge--en-progreso";
  }
  if (status === "RESUELTO") {
    return "badge badge--resuelto";
  }
  return "badge badge--cerrado";
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

export function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [statusSelection, setStatusSelection] = useState<TicketStatus>("ABIERTO");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");

  async function loadTicket(): Promise<void> {
    if (id === undefined) {
      setError("El ticket solicitado no existe.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await getTicket(id);
      setTicket(data);
      setStatusSelection(data.status);
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTicket();
  }, [id]);

  async function handleSubscribe(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (ticket === null) {
      return;
    }
    setActionError("");
    try {
      await subscribeToTicket(ticket.id);
      setTicket({ ...ticket, isSubscribed: true });
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  }

  async function handleUnsubscribe(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (ticket === null) {
      return;
    }
    setActionError("");
    try {
      await unsubscribeFromTicket(ticket.id);
      setTicket({ ...ticket, isSubscribed: false });
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  }

  async function handleChangeStatus(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (ticket === null) {
      return;
    }
    setActionError("");
    try {
      const updated = await changeTicketStatus(ticket.id, { status: statusSelection });
      setTicket({ ...ticket, status: updated.status, updatedAt: updated.updatedAt });
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  }

  async function handleDelete(): Promise<void> {
    if (ticket === null) {
      return;
    }
    const confirmed = window.confirm("¿Seguro que querés eliminar este ticket?");
    if (!confirmed) {
      return;
    }
    setActionError("");
    try {
      await deleteTicket(ticket.id);
      navigate("/tickets");
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  }

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">{ticket !== null ? `Ticket #${ticket.id}` : "Detalle del ticket"}</h1>
        <div className="page__actions">
          <Link className="btn btn--secondary" to="/tickets">
            Volver al listado
          </Link>
        </div>
      </header>

      {loading && (
        <div className="state state--loading" role="status">
          <div className="state__spinner"></div>
          <p className="state__title">Cargando ticket</p>
          <p className="state__text">Esto puede demorar unos segundos.</p>
        </div>
      )}

      {!loading && error !== "" && (
        <div className="state state--error" role="alert">
          <p className="state__title">No se pudo cargar el ticket</p>
          <p className="state__text">{error}</p>
          <div className="state__actions">
            <button className="btn btn--secondary btn--small" type="button" onClick={loadTicket}>
              Reintentar
            </button>
          </div>
        </div>
      )}

      {!loading && error === "" && ticket !== null && (
        <article className="card ticket-detail">
          <div className="ticket-detail__header">
            <h2>{ticket.title}</h2>
            <span className={getBadgeClassName(ticket.status)}>{ticket.status}</span>
          </div>
          <dl className="ticket-detail__meta">
            <div>
              <dt className="ticket-detail__term">Creado</dt>
              <dd className="ticket-detail__value">
                <time dateTime={ticket.createdAt}>{formatDate(ticket.createdAt)}</time>
              </dd>
            </div>
            <div>
              <dt className="ticket-detail__term">Actualizado</dt>
              <dd className="ticket-detail__value">
                <time dateTime={ticket.updatedAt}>{formatDate(ticket.updatedAt)}</time>
              </dd>
            </div>
          </dl>
          <p className="ticket-detail__description">{ticket.description}</p>
          {actionError !== "" && (
            <p className="form__error" role="alert">
              {actionError}
            </p>
          )}
          <div className="ticket-detail__actions">
            <div className="ticket-detail__group">
              {!ticket.isSubscribed && (
                <Can permission="subscription:create">
                  <form onSubmit={handleSubscribe}>
                    <button className="btn btn--primary" type="submit">
                      Suscribirse
                    </button>
                  </form>
                </Can>
              )}
              {ticket.isSubscribed && (
                <Can permission="subscription:delete">
                  <form onSubmit={handleUnsubscribe}>
                    <button className="btn btn--secondary" type="submit">
                      Desuscribirse
                    </button>
                  </form>
                </Can>
              )}
            </div>
            <Can permission="ticket:change-status">
              <form className="ticket-detail__group" onSubmit={handleChangeStatus}>
                <fieldset className="ticket-detail__group">
                  <legend className="visually-hidden">Cambiar estado</legend>
                  <label className="form__label" htmlFor="ticket-status">
                    Estado
                  </label>
                  <select
                    className="form__select form__select--inline"
                    id="ticket-status"
                    name="status"
                    value={statusSelection}
                    onChange={(event) => {
                      const selected = TICKET_STATUSES.find((status) => status === event.target.value);
                      if (selected !== undefined) {
                        setStatusSelection(selected);
                      }
                    }}
                  >
                    {TICKET_STATUSES.map((status) => (
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
            <div className="ticket-detail__group">
              <Can permission="ticket:update">
                <Link className="btn btn--secondary" to={`/tickets/${ticket.id}/edit`}>
                  Editar
                </Link>
              </Can>
              <Can permission="ticket:delete">
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
