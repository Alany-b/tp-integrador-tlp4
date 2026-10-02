import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { register } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errors";

export function RegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (user !== null) {
    return <Navigate to="/events" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (name.trim() === "") {
      setError("Ingresá tu nombre.");
      return;
    }
    if (email.trim() === "" || !email.includes("@")) {
      setError("Ingresá un correo electrónico válido.");
      return;
    }
    if (password === "") {
      setError("Ingresá la contraseña.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate("/login");
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth">
      <section className="auth__card">
        <span className="auth__brand">Gestor de Eventos</span>
        <h1 className="auth__title">Crear cuenta</h1>
        <form className="form" onSubmit={handleSubmit}>
          {error !== "" && (
            <p className="form__error" role="alert">
              {error}
            </p>
          )}
          <fieldset className="form__group">
            <legend className="visually-hidden">Datos de acceso</legend>
            <div className="form__field">
              <label className="form__label" htmlFor="register-name">
                Nombre
              </label>
              <input
                className="form__input"
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="form__field">
              <label className="form__label" htmlFor="register-email">
                Correo electrónico
              </label>
              <input
                className="form__input"
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nombre@tp.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="form__field">
              <label className="form__label" htmlFor="register-password">
                Contraseña
              </label>
              <input
                className="form__input"
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </fieldset>
          <div className="form__actions">
            <button className="btn btn--primary" type="submit" disabled={submitting}>
              Crear cuenta
            </button>
          </div>
        </form>
        <p className="auth__footer">
          ¿Ya tenés cuenta? <Link to="/login">Ingresar</Link>
        </p>
      </section>
    </main>
  );
}
