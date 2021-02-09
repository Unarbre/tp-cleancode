import { Adaptor } from "src/core/adaptor/Adaptor";
import { CreateBookDto } from "../dto/create-book.dto";
import { Book } from "../mongo/book.mongo";

export class BookDtoAdapter implements Adaptor<CreateBookDto, Book> {
    adapt(source: CreateBookDto) : Book {
        return {
            title: source.title,
            authorName: source.authorName
        }
    }
}