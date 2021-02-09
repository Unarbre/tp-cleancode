
import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserType } from 'src/user/enum/user-type.enum';
import { UserService } from 'src/user/user.service';
import { ErrorsEnum } from '../errors/errors.enum';

@Injectable()
export class LoginMiddleware implements NestMiddleware {

    constructor(private userService: UserService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            throw new HttpException(ErrorsEnum.DENIED_ACCESS_ERROR_MESSAGE, HttpStatus.FORBIDDEN);
        }
        const token = req.headers.authorization.split('Bearer ')[1];
        const user = await this.userService.findById(token);

        if (!user) {
            throw new HttpException(ErrorsEnum.DENIED_ACCESS_ERROR_MESSAGE, HttpStatus.FORBIDDEN);
        }
        next();
    }
}
