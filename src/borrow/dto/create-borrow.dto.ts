import { IsNotEmpty, IsString, isString } from "class-validator";

export class CreateBorrowDto {
    @IsNotEmpty()
    @IsString()
    bookId: string;

    @IsNotEmpty()
    @IsString()
    borrower: string;
}
