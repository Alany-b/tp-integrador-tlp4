import type { EventStatus } from "../types";

const BADGE_CLASS_NAMES: Record<EventStatus, string> = {
  PROGRAMADO: "badge badge--programado",
  REPROGRAMADO: "badge badge--reprogramado",
  CANCELADO: "badge badge--cancelado",
  FINALIZADO: "badge badge--finalizado",
};

interface StatusBadgeProps {
  status: EventStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={BADGE_CLASS_NAMES[status]}>{status}</span>;
}
