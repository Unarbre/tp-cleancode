import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { UserType } from "../enum/user-type.enum";

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @Max(Object.keys(UserType).length - 4)
    @Min(0)
    type: UserType;
}
