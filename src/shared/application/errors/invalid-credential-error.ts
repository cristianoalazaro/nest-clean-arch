export class InvalidCredentialError extends Error {
  constructor(message: string) {
    super(message)
    this.name = InvalidCredentialError.name
  }
}
