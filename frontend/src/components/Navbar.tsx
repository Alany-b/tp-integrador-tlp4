import { Link, NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Can } from "./Can";
import { NotificationBell } from "./NotificationBell";

interface NavLinkState {
  isActive: boolean;
}

function getLinkClassName(state: NavLinkState): string {
  if (state.isActive) {
    return "navbar__link navbar__link--active";
  }
  return "navbar__link";
}

export function Navbar() {
  const { user, logout } = useAuth();

  if (user === null) {
    return null;
  }

  return (
    <nav className="navbar" aria-label="Principal">
      <Link className="navbar__brand" to="/">Gestor de Eventos</Link>
      <div className="navbar__links">
        <NavLink className={getLinkClassName} to="/events">Eventos</NavLink>
        <Can permission="user:read">
          <NavLink className={getLinkClassName} to="/admin/users">Usuarios</NavLink>
        </Can>
      </div>
      <NotificationBell />
      <div className="navbar__user">
        <span className="navbar__email">{user.email}</span>
        <span className="navbar__role">{user.role}</span>
        <button className="btn btn--secondary btn--small navbar__logout" type="button" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
