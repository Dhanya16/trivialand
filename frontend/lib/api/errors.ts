export class ApiError extends Error {
  statusCode: number;
  path?: string;

  constructor(statusCode: number, message: string, path?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.path = path;
  }
}

export async function parseApiError(response: Response): Promise<ApiError> {
  let message = response.statusText;
  let path: string | undefined;

  try {
    const body = (await response.json()) as {
      message?: string | string[];
      path?: string;
    };
    if (Array.isArray(body.message)) {
      message = body.message.join(", ");
    } else if (body.message) {
      message = body.message;
    }
    path = body.path;
  } catch {
    // ignore JSON parse errors
  }

  return new ApiError(response.status, message, path);
}
