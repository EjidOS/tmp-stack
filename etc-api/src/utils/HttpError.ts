export default class HttpError extends Error {
  public static badRequest(): HttpError {
    return new HttpError('Bad Request.', 400)
  }
  public static unauthorized(error: any): HttpError {
    return new HttpError('Unauthorized.', 401, error)
  }
  public static forbidden(): HttpError {
    return new HttpError('Forbidden.', 403)
  }
  public static notFound(): HttpError {
    return new HttpError('Not Found.', 404)
  }
  public static methodNotAllowed(): HttpError {
    return new HttpError('Method Not Allowed.', 405)
  }
  public static notAcceptable(): HttpError {
    return new HttpError('Not Acceptable.', 406)
  }
  public static unsupportedMediaType(): HttpError {
    return new HttpError('Unsupported Media Type.', 415)
  }
  public static unprocessableEntity(error: any): HttpError {
    return new HttpError('Unprocessable Entity.', 422, error)
  }
  public static internalServerError(): HttpError {
    return new HttpError('Internal Server Error.', 500)
  }
  public static notImplemented(): HttpError {
    return new HttpError('Not Implemented.', 501)
  }
  public static conflict(msg: string, error: any = true): HttpError {
    return new HttpError(msg, 409, error)
  }
  constructor(
    public readonly message: string,
    public readonly status: number,
    public readonly error: any = true
  ) {
    super(message)
  }
}
