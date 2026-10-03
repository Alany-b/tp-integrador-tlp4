import { useEffect, useState } from "react";
import { Link } from "react-router";
import { listNotifications, onNotificationsChanged } from "../api/notifications.api";
import { useAuth } from "../context/AuthContext";

const POLLING_INTERVAL_MS = 10000;

export function NotificationBell() {
  const { user, hasPermission } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const canRead = user !== null && hasPermission("notification:read");

  useEffect(() => {
    if (!canRead) {
      setUnreadCount(0);
      return;
    }

    let active = true;

    async function loadUnreadCount(): Promise<void> {
      try {
        const notifications = await listNotifications();
        if (active) {
          setUnreadCount(notifications.filter((notification) => !notification.read).length);
        }
      } catch {
        return;
      }
    }

    loadUnreadCount();
    const intervalId = setInterval(loadUnreadCount, POLLING_INTERVAL_MS);
    const unsubscribe = onNotificationsChanged(loadUnreadCount);

    return () => {
      active = false;
      clearInterval(intervalId);
      unsubscribe();
    };
  }, [canRead]);

  const countClassName = unreadCount === 0 ? "bell__count bell__count--empty" : "bell__count";

  return (
    <Link className="bell" to="/notifications" aria-label={`Notificaciones: ${unreadCount} sin leer`}>
      <svg
        className="bell__icon"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
      <span className={countClassName}>{unreadCount}</span>
    </Link>
  );
}
