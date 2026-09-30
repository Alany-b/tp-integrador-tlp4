export interface INotifier {
  send(message: string): Promise<void>;
}