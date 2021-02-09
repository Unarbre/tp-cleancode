import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { BookModule } from './book/book.module';
import { AdminMiddleware } from './core/middlewares/admin.middleware';
import { UserDtoAdapter } from './user/adapter/user-dto.adapter';
import { User } from './user/entities/user.entity';
import { UserSchema } from './user/mongo/user.mongo';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { BorrowModule } from './borrow/borrow.module';
import { LoginMiddleware } from './core/middlewares/login.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/book'),
    BookModule,
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BorrowModule,
  ],
  controllers: [AppController],
  providers: [UserService, UserDtoAdapter],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {

    consumer
      .apply(AdminMiddleware)
      .exclude({ path: 'book', method: RequestMethod.GET },)
      .forRoutes('book', 'borrow')
      .apply(LoginMiddleware)
      .forRoutes({ path: 'book', method: RequestMethod.GET })

  }
}
