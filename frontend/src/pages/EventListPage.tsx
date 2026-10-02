import { useEffect, useState } from "react";
import { Link } from "react-router";
import { listEvents } from "../api/events.api";
import { Can } from "../components/Can";
import type { Event } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { formatDate } from "../utils/format";
import { getErrorMessage } from "../utils/errors";
import { StateMessage } from "../components/StateMessage";

export function EventListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  async function loadEvents(): Promise<void> {
    setLoading(true);
    setError("");
    try {
      const data = await listEvents();
      setEvents(data);
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">Eventos</h1>
        <div className="page__actions">
          <Can permission="event:create">
            <Link className="btn btn--primary" to="/events/new">
              Nuevo evento
            </Link>
          </Can>
        </div>
      </header>

      {loading && (
        <StateMessage variant="loading" title="Cargando eventos" />
      )}

      {!loading && error !== "" && (
        <StateMessage variant="error" title="No se pudieron cargar los eventos" text={error} onRetry={loadEvents} />
      )}

      {!loading && error === "" && events.length === 0 && (
        <StateMessage variant="empty" title="Todavía no hay eventos" text="Cuando se cree un evento, aparecerá en este listado." />
      )}

      {!loading && error === "" && events.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <caption className="visually-hidden">Listado de eventos</caption>
            <thead>
              <tr className="table__row">
                <th className="table__cell table__cell--head" scope="col">Id</th>
                <th className="table__cell table__cell--head" scope="col">Título</th>
                <th className="table__cell table__cell--head" scope="col">Fecha del evento</th>
                <th className="table__cell table__cell--head" scope="col">Estado</th>
                <th className="table__cell table__cell--head" scope="col">Actualizado</th>
                <th className="table__cell table__cell--head" scope="col">
                  <span className="visually-hidden">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr className="table__row" key={event.id}>
                  <td className="table__cell table__cell--id">#{event.id}</td>
                  <td className="table__cell">{event.title}</td>
                  <td className="table__cell table__cell--date">
                    <time dateTime={event.eventDate}>{formatDate(event.eventDate)}</time>
                  </td>
                  <td className="table__cell">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="table__cell table__cell--date">
                    <time dateTime={event.updatedAt}>{formatDate(event.updatedAt)}</time>
                  </td>
                  <td className="table__cell table__cell--actions">
                    <Link to={`/events/${event.id}`}>Ver detalle</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
