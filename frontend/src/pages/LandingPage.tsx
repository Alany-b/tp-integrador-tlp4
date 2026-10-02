import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import "../landing.css";

function BellIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export function LandingPage() {
  const { user } = useAuth();
  const isGuest = user === null;
  const mainPath = isGuest ? "/register" : "/events";
  const heroLabel = isGuest ? "Empezar ahora" : "Ir a mis eventos";
  const closingLabel = isGuest ? "Registrarse" : "Ir a mis eventos";

  return (
    <div className="lp">
      <a className="lp-skip-link" href="#contenido">Saltar al contenido</a>

      {isGuest && (
        <header className="lp-topbar">
          <div className="lp-container lp-topbar__inner">
            <Link className="lp-brand" to="/">Gestor de Eventos</Link>
            <nav className="lp-topbar__actions" aria-label="Cuenta">
              <Link className="lp-topbar__link" to="/login">Iniciar sesión</Link>
              <Link className="lp-btn lp-btn-primary" to="/register">Registrarse</Link>
            </nav>
          </div>
        </header>
      )}

      <main id="contenido">
        <section className="lp-hero" aria-labelledby="hero-title">
          <div className="lp-container lp-hero__inner">
            <div>
              <h1 className="lp-hero__title" id="hero-title">Tus eventos, su estado y cada cambio, en un solo lugar.</h1>
              <p className="lp-hero__subtitle">Creá eventos o sumate a los que ya existen, y enterate al momento si se reprograman o se cancelan.</p>
              <div className="lp-hero__actions">
                <Link className="lp-btn lp-btn-primary" to={mainPath}>{heroLabel}</Link>
              </div>
            </div>

            <div className="lp-illus" aria-hidden="true">
              <div className="lp-illus__back">
                <div className="lp-illus__back-grid">
                  <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span className="is-marked"></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                </div>
              </div>
              <div className="lp-event-card">
                <div className="lp-event-card__top">
                  <div className="lp-event-card__date">
                    <span className="lp-event-card__month">OCT</span>
                    <span className="lp-event-card__day">14</span>
                  </div>
                  <span className="lp-badge lp-badge--programado">Programado</span>
                </div>
                <div className="lp-event-card__line"></div>
                <div className="lp-event-card__line lp-event-card__line--muted"></div>
                <div className="lp-event-card__foot">
                  <BellIcon className="lp-event-card__bell" />
                  Avisos activados para este evento
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-section lp-section--surface" aria-labelledby="funciones-title">
          <div className="lp-container">
            <div className="lp-section__head">
              <h2 className="lp-section__title" id="funciones-title">Qué podés hacer</h2>
            </div>
            <ul className="lp-grid-3">
              <li className="lp-feature">
                <svg className="lp-feature__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" />
                </svg>
                <h3 className="lp-feature__title">Organizar eventos</h3>
                <p className="lp-feature__text">Cargá título y descripción, y editalos cuando haga falta.</p>
              </li>
              <li className="lp-feature">
                <svg className="lp-feature__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                <h3 className="lp-feature__title">Seguir su estado</h3>
                <p className="lp-feature__text">Cada evento muestra si está programado, reprogramado, cancelado o finalizado.</p>
              </li>
              <li className="lp-feature">
                <BellIcon className="lp-feature__icon" />
                <h3 className="lp-feature__title">Recibir avisos de cambios</h3>
                <p className="lp-feature__text">Si un evento al que te suscribiste cambia, te avisamos.</p>
              </li>
            </ul>
          </div>
        </section>

        <section className="lp-section" aria-labelledby="estados-title">
          <div className="lp-container">
            <div className="lp-section__head">
              <h2 className="lp-section__title" id="estados-title">Cuatro estados, sin dudas</h2>
              <p className="lp-section__lead">Cada evento lleva una insignia que indica en qué momento está.</p>
            </div>
            <ul className="lp-states">
              <li className="lp-state">
                <span className="lp-badge lp-badge--programado">Programado</span>
                <p className="lp-state__text">Tiene fecha confirmada y todavía no se realizó.</p>
              </li>
              <li className="lp-state">
                <span className="lp-badge lp-badge--reprogramado">Reprogramado</span>
                <p className="lp-state__text">Cambió de fecha u hora. Los suscriptos reciben aviso.</p>
              </li>
              <li className="lp-state">
                <span className="lp-badge lp-badge--cancelado">Cancelado</span>
                <p className="lp-state__text">No se va a realizar. Los suscriptos reciben aviso.</p>
              </li>
              <li className="lp-state">
                <span className="lp-badge lp-badge--finalizado">Finalizado</span>
                <p className="lp-state__text">Ya terminó; queda como registro.</p>
              </li>
            </ul>
          </div>
        </section>

        <section className="lp-section lp-section--surface" aria-labelledby="pasos-title">
          <div className="lp-container">
            <div className="lp-section__head">
              <h2 className="lp-section__title" id="pasos-title">Cómo funciona</h2>
            </div>
            <ol className="lp-grid-3 lp-steps">
              <li className="lp-step">
                <h3 className="lp-step__title">Registrate</h3>
                <p className="lp-step__text">Creá tu cuenta con tu correo y una contraseña.</p>
              </li>
              <li className="lp-step">
                <h3 className="lp-step__title">Explorá o creá eventos</h3>
                <p className="lp-step__text">Buscá eventos publicados o cargá el tuyo.</p>
              </li>
              <li className="lp-step">
                <h3 className="lp-step__title">Suscribite y recibí avisos</h3>
                <p className="lp-step__text">Seguí los eventos que te interesan y enterate de cada cambio.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="lp-section" aria-labelledby="roles-title">
          <div className="lp-container">
            <div className="lp-section__head">
              <h2 className="lp-section__title" id="roles-title">Roles</h2>
              <p className="lp-section__lead">Cada cuenta tiene permisos según su rol.</p>
            </div>
            <div className="lp-grid-3">
              <section className="lp-role" aria-labelledby="rol-usuario">
                <h3 className="lp-role__title" id="rol-usuario">Usuario</h3>
                <ul className="lp-role__list">
                  <li>Ve los eventos publicados.</li>
                  <li>Se suscribe y recibe avisos.</li>
                </ul>
              </section>
              <section className="lp-role" aria-labelledby="rol-operador">
                <h3 className="lp-role__title" id="rol-operador">Operador</h3>
                <ul className="lp-role__list">
                  <li>Crea y edita eventos.</li>
                  <li>Cambia su estado.</li>
                </ul>
              </section>
              <section className="lp-role" aria-labelledby="rol-admin">
                <h3 className="lp-role__title" id="rol-admin">Admin</h3>
                <ul className="lp-role__list">
                  <li>Gestiona cuentas y asigna roles.</li>
                  <li>Puede editar o cancelar cualquier evento.</li>
                </ul>
              </section>
            </div>
          </div>
        </section>

        <section className="lp-section lp-section--surface" aria-labelledby="cierre-title">
          <div className="lp-container lp-cta">
            <div>
              <h2 className="lp-cta__title" id="cierre-title">Empezá a organizar tus eventos.</h2>
              <p className="lp-cta__text">Crear una cuenta lleva menos de un minuto.</p>
            </div>
            <Link className="lp-btn lp-btn-primary" to={mainPath}>{closingLabel}</Link>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-container lp-footer__inner">
          <span className="lp-footer__name">Gestor de Eventos</span>
        </div>
      </footer>
    </div>
  );
}
