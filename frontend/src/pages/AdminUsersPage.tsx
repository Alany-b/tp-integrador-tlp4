import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { assignUserRole, listUsers } from "../api/users.api";
import { Can } from "../components/Can";
import { ROLES } from "../types";
import type { Role, User } from "../types";
import { getErrorMessage } from "../utils/errors";
import { StateMessage } from "../components/StateMessage";

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, Role>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");

  async function loadUsers(): Promise<void> {
    setLoading(true);
    setError("");
    try {
      const data = await listUsers();
      const roles: Record<string, Role> = {};
      for (const user of data) {
        roles[String(user.id)] = user.role;
      }
      setUsers(data);
      setSelectedRoles(roles);
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSave(event: FormEvent<HTMLFormElement>, user: User): Promise<void> {
    event.preventDefault();
    setActionError("");
    try {
      const updated = await assignUserRole(user.id, { role: selectedRoles[String(user.id)] });
      setUsers(users.map((item) => (item.id === user.id ? { ...item, role: updated.role } : item)));
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  }

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">Usuarios</h1>
      </header>

      {actionError !== "" && (
        <p className="form__error" role="alert">
          {actionError}
        </p>
      )}

      {loading && (
        <StateMessage variant="loading" title="Cargando usuarios" />
      )}

      {!loading && error !== "" && (
        <StateMessage variant="error" title="No se pudieron cargar los usuarios" text={error} onRetry={loadUsers} />
      )}

      {!loading && error === "" && users.length === 0 && (
        <StateMessage variant="empty" title="Todavía no hay usuarios" text="Cuando se registre un usuario, aparecerá en este listado." />
      )}

      {!loading && error === "" && users.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <caption className="visually-hidden">Administración de usuarios</caption>
            <thead>
              <tr className="table__row">
                <th className="table__cell table__cell--head" scope="col">Id</th>
                <th className="table__cell table__cell--head" scope="col">Correo electrónico</th>
                <th className="table__cell table__cell--head" scope="col">Rol actual</th>
                <th className="table__cell table__cell--head" scope="col">Cambiar rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr className="table__row" key={user.id}>
                  <td className="table__cell table__cell--id">{user.id}</td>
                  <td className="table__cell">{user.email}</td>
                  <td className="table__cell">{user.role}</td>
                  <td className="table__cell">
                    <Can permission="user:assign-role">
                      <form className="table__cell--form" onSubmit={(event) => handleSave(event, user)}>
                        <label className="visually-hidden" htmlFor={`role-${user.id}`}>
                          Rol de {user.email}
                        </label>
                        <select
                          className="form__select form__select--inline"
                          id={`role-${user.id}`}
                          name="role"
                          value={selectedRoles[String(user.id)]}
                          onChange={(event) => {
                            const selected = ROLES.find((role) => role === event.target.value);
                            if (selected !== undefined) {
                              setSelectedRoles({ ...selectedRoles, [String(user.id)]: selected });
                            }
                          }}
                        >
                          {ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        <button className="btn btn--secondary btn--small" type="submit">
                          Guardar
                        </button>
                      </form>
                    </Can>
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
