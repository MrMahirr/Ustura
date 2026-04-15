import { Global, Module } from '@nestjs/common';
import { EmailJsService } from './emailjs.service';
import { EMAIL_SERVICE } from './interfaces/email.types';

@Global()
@Module({
  providers: [
    EmailJsService,
    {
      provide: EMAIL_SERVICE,
      useExisting: EmailJsService,
    },
  ],
  exports: [EMAIL_SERVICE],
})
export class EmailModule {}
