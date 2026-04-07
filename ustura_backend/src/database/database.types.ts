import { QueryResult, QueryResultRow } from 'pg';

export interface SqlQuery {
  text: string;
  values?: readonly unknown[];
  name?: string;
}

export interface SqlQueryExecutor {
  query<T extends QueryResultRow = QueryResultRow>(
    query: SqlQuery | string,
    values?: readonly unknown[],
  ): Promise<QueryResult<T>>;
}

export type DatabaseTransaction = SqlQueryExecutor;
