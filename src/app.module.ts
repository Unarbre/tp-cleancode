import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [BookModule, UserModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
