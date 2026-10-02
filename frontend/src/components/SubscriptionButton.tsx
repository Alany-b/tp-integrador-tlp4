import type { FormEvent } from "react";
import { subscribeToEvent, unsubscribeFromEvent } from "../api/events.api";
import { getErrorMessage } from "../utils/errors";
import { Can } from "./Can";
import type { Id } from "../types";

interface SubscriptionButtonProps {
  eventId: Id;
  isSubscribed: boolean;
  onChange: (isSubscribed: boolean) => void;
  onError: (message: string) => void;
}

export function SubscriptionButton({ eventId, isSubscribed, onChange, onError }: SubscriptionButtonProps) {
  async function handleSubscribe(submitEvent: FormEvent<HTMLFormElement>): Promise<void> {
    submitEvent.preventDefault();
    onError("");
    try {
      await subscribeToEvent(eventId);
      onChange(true);
    } catch (caught) {
      onError(getErrorMessage(caught));
    }
  }

  async function handleUnsubscribe(submitEvent: FormEvent<HTMLFormElement>): Promise<void> {
    submitEvent.preventDefault();
    onError("");
    try {
      await unsubscribeFromEvent(eventId);
      onChange(false);
    } catch (caught) {
      onError(getErrorMessage(caught));
    }
  }

  if (isSubscribed) {
    return (
      <Can permission="subscription:delete">
        <form onSubmit={handleUnsubscribe}>
          <button className="btn btn--secondary" type="submit">
            Desuscribirse
          </button>
        </form>
      </Can>
    );
  }

  return (
    <Can permission="subscription:create">
      <form onSubmit={handleSubscribe}>
        <button className="btn btn--primary" type="submit">
          Suscribirse
        </button>
      </form>
    </Can>
  );
}
