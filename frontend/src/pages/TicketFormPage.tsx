import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { createTicket, getTicket, updateTicket } from "../api/tickets.api";
import { ApiError } from "../api/client";

function getErrorMessage(caught: unknown): string {
  if (caught instanceof ApiError) {
    return caught.message;
  }
  return "Ocurrió un error inesperado.";
}

export function TicketFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id !== undefined;
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [loadError, setLoadError] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function loadTicket(): Promise<void> {
    if (id === undefined) {
      return;
    }
    setLoading(true);
    setLoadError("");
    try {
      const ticket = await getTicket(id);
      setTitle(ticket.title);
      setDescription(ticket.description);
    } catch (caught) {
      setLoadError(getErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTicket();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (title.trim().length < 5) {
      setError("El título es obligatorio y debe tener al menos 5 caracteres.");
      return;
    }
    if (description.trim() === "") {
      setError("La descripción es obligatoria.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const body = { title: title.trim(), description: description.trim() };
      if (id === undefined) {
        await createTicket(body);
      } else {
        await updateTicket(id, body);
      }
      navigate("/tickets");
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  const prefix = isEditing ? "edit" : "new";
  const cancelPath = isEditing ? `/tickets/${id}` : "/tickets";

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">{isEditing ? "Editar ticket" : "Nuevo ticket"}</h1>
      </header>

      {loading && (
        <div className="state state--loading" role="status">
          <div className="state__spinner"></div>
          <p className="state__title">Cargando ticket</p>
          <p className="state__text">Esto puede demorar unos segundos.</p>
        </div>
      )}

      {!loading && loadError !== "" && (
        <div className="state state--error" role="alert">
          <p className="state__title">No se pudo cargar el ticket</p>
          <p className="state__text">{loadError}</p>
          <div className="state__actions">
            <button className="btn btn--secondary btn--small" type="button" onClick={loadTicket}>
              Reintentar
            </button>
          </div>
        </div>
      )}

      {!loading && loadError === "" && (
        <section className="card">
          <form className="form form--narrow" onSubmit={handleSubmit}>
            {error !== "" && (
              <p className="form__error" role="alert">
                {error}
              </p>
            )}
            <fieldset className="form__group">
              <legend className="form__legend">Datos del ticket</legend>
              <div className="form__field">
                <label className="form__label" htmlFor={`${prefix}-title`}>
                  Título
                </label>
                <input
                  className="form__input"
                  id={`${prefix}-title`}
                  name="title"
                  type="text"
                  placeholder={isEditing ? undefined : "Resumen breve del problema"}
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div className="form__field">
                <label className="form__label" htmlFor={`${prefix}-description`}>
                  Descripción
                </label>
                <textarea
                  className="form__textarea"
                  id={`${prefix}-description`}
                  name="description"
                  rows={6}
                  placeholder={isEditing ? undefined : "Describí el problema con el mayor detalle posible"}
                  required
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                ></textarea>
              </div>
            </fieldset>
            <div className="form__actions">
              <button className="btn btn--primary" type="submit" disabled={submitting}>
                Guardar
              </button>
              <Link className="btn btn--secondary" to={cancelPath}>
                Cancelar
              </Link>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
