import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';
import { resolveEnvFilePaths, validateEnvironment } from './env.validation';

const envFilePaths = resolveEnvFilePaths();

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      ...(envFilePaths.length > 0 ? { envFilePath: envFilePaths } : {}),
      validate: validateEnvironment,
    }),
  ],
  providers: [AppConfigService],
  exports: [NestConfigModule, AppConfigService],
})
export class ConfigModule {
  // Centralizes environment access behind a typed boundary.
}
