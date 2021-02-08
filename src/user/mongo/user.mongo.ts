
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserType } from '../enum/user-type.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ require: true })
    name: string;

    @Prop({ require: true })
    type: UserType;
}

export const UserSchema = SchemaFactory.createForClass(User);
