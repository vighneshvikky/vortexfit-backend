export const IAISERVICE = Symbol('IAISERVICE');

export interface IAIService {
  chatWithAI(userMessage: string, personality: string): Promise<string>;
}
