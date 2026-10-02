export type Observer<T> = (payload: T) => void;

export class Subject<T> {
  private readonly observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): () => void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
    return () => this.unsubscribe(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(payload: T): void {
    const observers = [...this.observers];
    for (const observer of observers) {
      observer(payload);
    }
  }
}
