
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserType } from '../enum/user-type.enum';
import * as mongoose from 'mongoose';
import { Borrow } from 'src/book/mongo/borrow.mongo';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ require: true })
    name: string;

    @Prop({ require: true })
    type: UserType;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Borrow', default: [] })
    borrows: Borrow[];
}

export const UserSchema = SchemaFactory.createForClass(User);
