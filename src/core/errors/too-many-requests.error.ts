export class TooManyRequestsError extends Error {
  constructor(
    message: string,
    public readonly field?: string, // одно поле
  ) {
    super(message);
  }
}
