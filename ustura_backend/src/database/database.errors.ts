interface DatabaseErrorMetadata {
  code?: string;
  constraint?: string;
  detail?: string;
  queryName?: string;
  queryText?: string;
  cause?: Error;
}

export class DatabaseError extends Error {
  readonly code?: string;
  readonly constraint?: string;
  readonly detail?: string;
  readonly queryName?: string;
  readonly queryText?: string;
  override readonly cause?: Error;

  constructor(message: string, metadata: DatabaseErrorMetadata = {}) {
    super(message);
    this.name = new.target.name;
    this.code = metadata.code;
    this.constraint = metadata.constraint;
    this.detail = metadata.detail;
    this.queryName = metadata.queryName;
    this.queryText = metadata.queryText;
    this.cause = metadata.cause;
  }
}

export class DatabaseConnectionError extends DatabaseError {}

export class DatabaseConstraintViolationError extends DatabaseError {}

export class DatabaseQueryError extends DatabaseError {}

export class DatabaseTransactionError extends DatabaseError {}
