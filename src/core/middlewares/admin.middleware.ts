
import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserType } from 'src/user/enum/user-type.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminMiddleware implements NestMiddleware {

    DENIED_ACCESS_ERROR_MESSAGE = "Access denied. Please provide a librarian user token.";

    constructor(private userService: UserService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            throw new HttpException(this.DENIED_ACCESS_ERROR_MESSAGE, HttpStatus.FORBIDDEN);
        }
        const token = req.headers.authorization.split('Bearer ')[1];
        const userType = await this.userService.getType(token);
        const isAllowed = userType === UserType.LIBRARIAN;

        if (!isAllowed) {
            throw new HttpException(this.DENIED_ACCESS_ERROR_MESSAGE, HttpStatus.FORBIDDEN);
        }
        next();
    }
}
