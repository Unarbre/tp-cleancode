
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserType } from '../enum/user-type.enum';
import * as mongoose from 'mongoose';
import { Book } from 'src/book/mongo/book.mongo';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ require: true })
    name: string;

    @Prop({ require: true })
    type: UserType;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Book', default: [] })
    borrowedBooks: Book[];
}

export const UserSchema = SchemaFactory.createForClass(User);
