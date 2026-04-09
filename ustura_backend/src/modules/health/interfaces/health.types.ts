export type HealthCheckStatus = 'up' | 'down';

export interface HealthCheckResult {
  status: HealthCheckStatus;
  message: string;
}

export interface ReadinessReport {
  status: 'ready' | 'not_ready';
  timestamp: string;
  checks: {
    database: HealthCheckResult;
    schemaMigrations: HealthCheckResult;
    usersTableSchema: HealthCheckResult;
    reservationsTableSchema: HealthCheckResult;
    redis: HealthCheckResult;
  };
}

export interface LivenessReport {
  status: 'ok';
  timestamp: string;
}
