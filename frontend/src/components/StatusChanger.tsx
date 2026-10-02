import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { changeEventStatus } from "../api/events.api";
import { getErrorMessage } from "../utils/errors";
import { Can } from "./Can";
import { EVENT_STATUSES } from "../types";
import type { Event, EventStatus, Id } from "../types";

interface StatusChangerProps {
  eventId: Id;
  currentStatus: EventStatus;
  onChange: (updated: Event) => void;
  onError: (message: string) => void;
}

export function StatusChanger({ eventId, currentStatus, onChange, onError }: StatusChangerProps) {
  const [selection, setSelection] = useState<EventStatus>(currentStatus);

  function handleSelect(changeEvent: ChangeEvent<HTMLSelectElement>): void {
    const selected = EVENT_STATUSES.find((status) => status === changeEvent.target.value);
    if (selected !== undefined) {
      setSelection(selected);
    }
  }

  async function handleSubmit(submitEvent: FormEvent<HTMLFormElement>): Promise<void> {
    submitEvent.preventDefault();
    onError("");
    try {
      const updated = await changeEventStatus(eventId, { status: selection });
      onChange(updated);
    } catch (caught) {
      onError(getErrorMessage(caught));
    }
  }

  return (
    <Can permission="event:change-status">
      <form className="event-detail__group" onSubmit={handleSubmit}>
        <fieldset className="event-detail__group">
          <legend className="visually-hidden">Cambiar estado</legend>
          <label className="form__label" htmlFor="event-status">
            Estado
          </label>
          <select
            className="form__select form__select--inline"
            id="event-status"
            name="status"
            value={selection}
            onChange={handleSelect}
          >
            {EVENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button className="btn btn--secondary" type="submit">
            Aplicar estado
          </button>
        </fieldset>
      </form>
    </Can>
  );
}
