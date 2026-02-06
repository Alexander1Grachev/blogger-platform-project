export class BadRequestError extends Error {
  constructor(
    message: string,
    public readonly field?: string, // одно поле
    //public readonly errors?: { field: string; message: string }[] // для нескольких
  ) {
    super(message);
  }
}
