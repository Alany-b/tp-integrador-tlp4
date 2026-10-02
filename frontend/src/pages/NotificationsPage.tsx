import { useEffect, useState } from "react";
import { listNotifications, markNotificationAsRead, notificationsChanged } from "../api/notifications.api";
import type { Id, Notification } from "../types";
import { formatDate } from "../utils/format";
import { getErrorMessage } from "../utils/errors";
import { StateMessage } from "../components/StateMessage";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");

  async function loadNotifications(): Promise<void> {
    setLoading(true);
    setError("");
    try {
      const data = await listNotifications();
      setNotifications(data);
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleMarkAsRead(id: Id): Promise<void> {
    setActionError("");
    try {
      await markNotificationAsRead(id);
      setNotifications(
        notifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification,
        ),
      );
      notificationsChanged.notify();
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  }

  async function handleMarkAllAsRead(): Promise<void> {
    setActionError("");
    const unread = notifications.filter((notification) => !notification.read);
    try {
      await Promise.all(unread.map((notification) => markNotificationAsRead(notification.id)));
      setNotifications(notifications.map((notification) => ({ ...notification, read: true })));
      notificationsChanged.notify();
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  }

  const hasUnread = notifications.some((notification) => !notification.read);

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">Notificaciones</h1>
        <div className="page__actions">
          <button className="btn btn--secondary" type="button" disabled={!hasUnread} onClick={handleMarkAllAsRead}>
            Marcar todas como leídas
          </button>
        </div>
      </header>

      {actionError !== "" && (
        <p className="form__error" role="alert">
          {actionError}
        </p>
      )}

      {loading && (
        <StateMessage variant="loading" title="Cargando notificaciones" />
      )}

      {!loading && error !== "" && (
        <StateMessage variant="error" title="No se pudieron cargar las notificaciones" text={error} onRetry={loadNotifications} />
      )}

      {!loading && error === "" && notifications.length === 0 && (
        <StateMessage variant="empty" title="Todavía no hay notificaciones" text="Cuando cambie el estado de un evento suscripto, aparecerá en este listado." />
      )}

      {!loading && error === "" && notifications.length > 0 && (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li
              className={notification.read ? "notification notification--read" : "notification notification--unread"}
              key={notification.id}
            >
              <div className="notification__body">
                <p className="notification__message">{notification.message}</p>
                <time className="notification__date" dateTime={notification.createdAt}>
                  {formatDate(notification.createdAt)}
                </time>
              </div>
              {!notification.read && (
                <button
                  className="btn btn--secondary btn--small"
                  type="button"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  Marcar como leída
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
