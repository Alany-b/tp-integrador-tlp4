# Patrones de Diseño Implementados

## SOLID
Se respetaron los principios SOLID, en particular:
- **Single Responsibility Principle (SRP)**: Cada clase tiene una única responsabilidad (ej. `EventService` maneja lógica de negocio, `EventRepository` acceso a datos, `EventController` peticiones HTTP).
- **Dependency Inversion Principle (DIP)**: Los servicios dependen de interfaces (ej. `IEventRepository`, `ITokenService`) y no de implementaciones concretas, permitiendo mayor modularidad.

## Singleton
Implementado en `DatabaseConnection`. Garantiza que toda la aplicación comparta la misma y única instancia de la conexión a la base de datos, optimizando recursos y previniendo fugas de conexión.

## Observer
Implementado en el dominio de Eventos. Cuando un evento cambia de estado, el `EventService` (quien no necesita conocer el detalle de las notificaciones) notifica al `EventPublisher` (el "Subject"). Este último avisa a todos sus `IObserver` suscritos (como `NotificationService`). Esto desacopla totalmente la lógica de eventos de la de envíos de alertas.

## Factory
Implementado con `NotifierFactory`. El `NotificationService` no crea directamente las instancias que envían los mensajes (consola, mail, base de datos). Simplemente pide a la fábrica el canal que necesita (`factory.create('console')`), delegando la decisión de qué objeto concreto instanciar.

## Adapter
Implementado en `ConsoleNotifierAdapter`. Se usa para adaptar la interfaz de una herramienta externa o nativa (en este caso un simple `console.log`) al contrato `INotifier` que espera el sistema. Así, el resto del código interactúa con el adaptador sin atarse a los detalles de la herramienta.
