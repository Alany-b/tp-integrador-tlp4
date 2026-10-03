import { Link } from "react-router";
import { StateMessage } from "../components/StateMessage";

export function NotFoundPage() {
  return (
    <main className="page">
      <StateMessage variant="empty" title="Página no encontrada" text="La dirección que ingresaste no existe.">
        <Link className="btn btn--secondary btn--small" to="/">
          Volver al inicio
        </Link>
      </StateMessage>
    </main>
  );
}
