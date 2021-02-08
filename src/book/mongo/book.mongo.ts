
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {

    @Prop({ require: true })
    title: string;

    @Prop({ require: true })
    authorName: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
