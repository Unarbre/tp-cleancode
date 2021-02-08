
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
    @Prop({ require: true })
    title: string;

    @Prop({ require: true })
    authorName: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
