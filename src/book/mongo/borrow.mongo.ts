import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Book } from './book.mongo';

export type BorrowDocument = Borrow & Document;

@Schema()
export class Borrow {
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Book', default: [] })
    book: Book;

    @Prop({ require: true })
    date: Date;

    @Prop({ require: true, default: false })
    returned: boolean;
}

export const BorrowSchema = SchemaFactory.createForClass(Borrow);
