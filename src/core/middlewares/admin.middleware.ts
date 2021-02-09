
import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserType } from 'src/user/enum/user-type.enum';
import { UserService } from 'src/user/user.service';
import { ErrorsEnum } from '../errors/errors.enum';

@Injectable()
export class AdminMiddleware implements NestMiddleware {

    BEARER_PART = 'Bearer ';

    constructor(private userService: UserService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            throw new HttpException(ErrorsEnum.ADMIN_DENIED_ACCESS, HttpStatus.FORBIDDEN);
        }
        const token = req.headers.authorization.split(this.BEARER_PART)[1];
        const userType = await this.userService.getType(token);
        const isAllowed = userType === UserType.LIBRARIAN;

        if (!isAllowed) {
            throw new HttpException(ErrorsEnum.ADMIN_DENIED_ACCESS, HttpStatus.FORBIDDEN);
        }
        next();
    }
}
