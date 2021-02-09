



export enum ErrorsEnum {
    USER_DOES_NOT_EXIST = 'User does not exist',
    BOOK_DOES_NOT_EXIST = 'Book does not exist',
    INVALID_ID = 'Id is not valid',


    GUEST_ARE_NOT_ALLOWED_TO_BORROW = 'Guests can not borrow',
    ALREADY_BORROWED = 'Book is already borrowed',
    BOOK_NOT_BORROWED = 'Book is not borrowed',
    USER_IS_NOT_BORROWER = 'The user is not the borrower',

    BORROW_LIMIT_EXCEED = 'Borrows limit exceeded',
    BORROW_TIME_EXCEED = 'One of your books has been borrowed too long time ago',


    DENIED_ACCESS_ERROR_MESSAGE = "Access denied. Please provide a user token.",

}