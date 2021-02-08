import { Adaptor } from "src/core/adaptor/Adaptor";
import { CreateBorrowDto } from "../dto/create-borrow.dto";
import { Borrow } from "../entities/borrow.entity";

export class BorrowDtoAdapter implements Adaptor<CreateBorrowDto, Borrow> {
    adapt(source: CreateBorrowDto): Borrow {
        return {
            date: new Date(),
            bookId: source.bookId,
        }
    }
}
