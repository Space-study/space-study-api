export interface ILogger {
  info(context: string, message: string): void;
  log(context: string, message: string): void;
  error(context: string, message: string, trace: string): void;
  warn(context: string, message: string, trace: object): void;
  debug(message: string): void;
}
