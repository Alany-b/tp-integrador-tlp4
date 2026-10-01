import { useEffect, useState } from "react";
import { listNotifications, markNotificationAsRead } from "../api/notifications.api";
import { ApiError } from "../api/client";
import type { Id, Notification } from "../types";

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

function getErrorMessage(caught: unknown): string {
  if (caught instanceof ApiError) {
    return caught.message;
  }
  return "Ocurrió un error inesperado.";
}

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
      window.dispatchEvent(new Event("notifications-updated"));
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
      window.dispatchEvent(new Event("notifications-updated"));
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
        <div className="state state--loading" role="status">
          <div className="state__spinner"></div>
          <p className="state__title">Cargando notificaciones</p>
          <p className="state__text">Esto puede demorar unos segundos.</p>
        </div>
      )}

      {!loading && error !== "" && (
        <div className="state state--error" role="alert">
          <p className="state__title">No se pudieron cargar las notificaciones</p>
          <p className="state__text">{error}</p>
          <div className="state__actions">
            <button className="btn btn--secondary btn--small" type="button" onClick={loadNotifications}>
              Reintentar
            </button>
          </div>
        </div>
      )}

      {!loading && error === "" && notifications.length === 0 && (
        <div className="state state--empty" role="status">
          <p className="state__title">Todavía no hay notificaciones</p>
          <p className="state__text">Cuando cambie el estado de un evento suscripto, aparecerá en este listado.</p>
        </div>
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
