import { Adaptor } from "src/core/adaptor/Adaptor";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/user.entity";


export class UserDtoAdapter implements Adaptor<CreateUserDto, User> {
    adapt(source: CreateUserDto): User {
        return {
            name: source.name,
            type: source.type
        }
    }
}