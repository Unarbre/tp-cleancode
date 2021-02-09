import { IsNotEmpty, IsString } from "class-validator";

export class ReturnBorrowDto {
    @IsNotEmpty()
    @IsString()
    bookId: string;

    @IsNotEmpty()
    @IsString()
    borrower: string;
}
