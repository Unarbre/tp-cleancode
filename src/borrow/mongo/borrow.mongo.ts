import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Book, BookDocument } from '../../book/mongo/book.mongo';

export type BorrowDocument = Borrow & Document;

@Schema()
export class Borrow {
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Book', default: [] })
    book: BookDocument | mongoose.ObjectId;

    @Prop({ require: true })
    date: Date;

    @Prop({ require: true, default: false })
    returned: boolean;
}

export const BorrowSchema = SchemaFactory.createForClass(Borrow);
