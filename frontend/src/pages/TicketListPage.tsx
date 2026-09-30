import { useEffect, useState } from "react";
import { Link } from "react-router";
import { listTickets } from "../api/tickets.api";
import { ApiError } from "../api/client";
import { Can } from "../components/Can";
import type { Ticket, TicketStatus } from "../types";

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

export function TicketListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  async function loadTickets(): Promise<void> {
    setLoading(true);
    setError("");
    try {
      const data = await listTickets();
      setTickets(data);
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
    loadTickets();
  }, []);

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">Tickets</h1>
        <div className="page__actions">
          <Can permission="ticket:create">
            <Link className="btn btn--primary" to="/tickets/new">
              Nuevo ticket
            </Link>
          </Can>
        </div>
      </header>

      {loading && (
        <div className="state state--loading" role="status">
          <div className="state__spinner"></div>
          <p className="state__title">Cargando tickets</p>
          <p className="state__text">Esto puede demorar unos segundos.</p>
        </div>
      )}

      {!loading && error !== "" && (
        <div className="state state--error" role="alert">
          <p className="state__title">No se pudieron cargar los tickets</p>
          <p className="state__text">{error}</p>
          <div className="state__actions">
            <button className="btn btn--secondary btn--small" type="button" onClick={loadTickets}>
              Reintentar
            </button>
          </div>
        </div>
      )}

      {!loading && error === "" && tickets.length === 0 && (
        <div className="state state--empty" role="status">
          <p className="state__title">Todavía no hay tickets</p>
          <p className="state__text">Cuando se cree un ticket, aparecerá en este listado.</p>
        </div>
      )}

      {!loading && error === "" && tickets.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <caption className="visually-hidden">Listado de tickets</caption>
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
              {tickets.map((ticket) => (
                <tr className="table__row" key={ticket.id}>
                  <td className="table__cell table__cell--id">#{ticket.id}</td>
                  <td className="table__cell">{ticket.title}</td>
                  <td className="table__cell">
                    <span className={getBadgeClassName(ticket.status)}>{ticket.status}</span>
                  </td>
                  <td className="table__cell table__cell--date">
                    <time dateTime={ticket.updatedAt}>{formatDate(ticket.updatedAt)}</time>
                  </td>
                  <td className="table__cell table__cell--actions">
                    <Link to={`/tickets/${ticket.id}`}>Ver detalle</Link>
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
