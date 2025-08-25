export type LogMessage = string | object;

export interface ILogger {
  log(message: LogMessage, context?: string): void;
  warn(message: LogMessage, context?: string): void;
  error(message: LogMessage, trace?: string, context?: string): void;
}
