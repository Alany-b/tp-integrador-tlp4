import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { deleteEvent, getEvent } from "../api/events.api";
import { Can } from "../components/Can";
import { ConfirmDialog } from "../components/ConfirmDialog";
import type { Event, EventDetail } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { StatusChanger } from "../components/StatusChanger";
import { SubscriptionButton } from "../components/SubscriptionButton";
import { formatDate } from "../utils/format";
import { getErrorMessage } from "../utils/errors";
import { StateMessage } from "../components/StateMessage";

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);

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
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvent();
  }, [id]);

  function handleSubscriptionChange(isSubscribed: boolean): void {
    if (event !== null) {
      setEvent({ ...event, isSubscribed });
    }
  }

  function handleStatusChange(updated: Event): void {
    if (event !== null) {
      setEvent({ ...event, status: updated.status, updatedAt: updated.updatedAt });
    }
  }

  async function handleDelete(): Promise<void> {
    if (event === null) {
      return;
    }
    setConfirmingDelete(false);
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
        <StateMessage variant="loading" title="Cargando evento" />
      )}

      {!loading && error !== "" && (
        <StateMessage variant="error" title="No se pudo cargar el evento" text={error} onRetry={loadEvent} />
      )}

      {!loading && error === "" && event !== null && (
        <article className="card event-detail">
          <div className="event-detail__header">
            <h2>{event.title}</h2>
            <StatusBadge status={event.status} />
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
              <SubscriptionButton
                eventId={event.id}
                isSubscribed={event.isSubscribed}
                onChange={handleSubscriptionChange}
                onError={setActionError}
              />
            </div>
            <StatusChanger
              eventId={event.id}
              currentStatus={event.status}
              onChange={handleStatusChange}
              onError={setActionError}
            />
            <div className="event-detail__group">
              <Can permission="event:update">
                <Link className="btn btn--secondary" to={`/events/${event.id}/edit`}>
                  Editar
                </Link>
              </Can>
              <Can permission="event:delete">
                <button className="btn btn--danger" type="button" onClick={() => setConfirmingDelete(true)}>
                  Eliminar
                </button>
              </Can>
            </div>
          </div>
        </article>
      )}
      <ConfirmDialog
        open={confirmingDelete}
        title="Eliminar evento"
        message="Esta acción no se puede deshacer. ¿Seguro que querés eliminar este evento?"
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </main>
  );
}
