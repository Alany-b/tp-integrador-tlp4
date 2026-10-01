import { useEffect, useState } from "react";
import { Link } from "react-router";
import { listEvents } from "../api/events.api";
import { ApiError } from "../api/client";
import { Can } from "../components/Can";
import type { Event, EventStatus } from "../types";

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
      if (caught instanceof ApiError) {
        setError(caught.message);
      } else {
        setError("Ocurrió un error inesperado.");
      }
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
        <div className="state state--loading" role="status">
          <div className="state__spinner"></div>
          <p className="state__title">Cargando eventos</p>
          <p className="state__text">Esto puede demorar unos segundos.</p>
        </div>
      )}

      {!loading && error !== "" && (
        <div className="state state--error" role="alert">
          <p className="state__title">No se pudieron cargar los eventos</p>
          <p className="state__text">{error}</p>
          <div className="state__actions">
            <button className="btn btn--secondary btn--small" type="button" onClick={loadEvents}>
              Reintentar
            </button>
          </div>
        </div>
      )}

      {!loading && error === "" && events.length === 0 && (
        <div className="state state--empty" role="status">
          <p className="state__title">Todavía no hay eventos</p>
          <p className="state__text">Cuando se cree un evento, aparecerá en este listado.</p>
        </div>
      )}

      {!loading && error === "" && events.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <caption className="visually-hidden">Listado de eventos</caption>
            <thead>
              <tr className="table__row">
                <th className="table__cell table__cell--head" scope="col">Id</th>
                <th className="table__cell table__cell--head" scope="col">Título</th>
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
                  <td className="table__cell">
                    <span className={getBadgeClassName(event.status)}>{event.status}</span>
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
