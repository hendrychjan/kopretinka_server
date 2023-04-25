import { Prisma } from "@prisma/client";

export class ServiceError {
  httpCode: number;
  message: string;
  details?: string;

  public constructor(httpCode: number, message: string, details?: string) {
    this.httpCode = httpCode;
    this.message = message;
    this.details = details;
  }
}

export function parseToServiceError(
  e: unknown,
  resource: string // this is no longer used, but it could be used to provide more details in the error message
): ServiceError {
  console.log(e);

  if (e instanceof ServiceError) {
    return e;
  }

  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2025") {
      return new ServiceError(404, `Record not found`);
    }
    if (e.code === "P2002") {
      return new ServiceError(400, "Unique constraint failed");
    }
    return new ServiceError(500, "Prisma client error");
  }

  return new ServiceError(500, "Server error.");
}
