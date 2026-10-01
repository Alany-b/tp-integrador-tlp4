import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (user !== null) {
    return <Navigate to="/events" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

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
      await login(email.trim(), password);
      navigate("/events");
    } catch (caught) {
      if (caught instanceof ApiError) {
        setError(caught.message);
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth">
      <section className="auth__card">
        <span className="auth__brand">Mesa de Ayuda</span>
        <h1 className="auth__title">Ingresar</h1>
        <form className="form" onSubmit={handleSubmit}>
          {error !== "" && (
            <p className="form__error" role="alert">
              {error}
            </p>
          )}
          <fieldset className="form__group">
            <legend className="visually-hidden">Datos de acceso</legend>
            <div className="form__field">
              <label className="form__label" htmlFor="login-email">
                Correo electrónico
              </label>
              <input
                className="form__input"
                id="login-email"
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
              <label className="form__label" htmlFor="login-password">
                Contraseña
              </label>
              <input
                className="form__input"
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </fieldset>
          <div className="form__actions">
            <button className="btn btn--primary" type="submit" disabled={submitting}>
              Ingresar
            </button>
          </div>
        </form>
        <p className="auth__footer">
          ¿No tenés cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </section>
    </main>
  );
}
