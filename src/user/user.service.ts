import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RegisterUserResponse } from "src/interfaces/user";
import { RegisterDto } from "./dto/register.dto";
import { User } from "./user.entity";

@Injectable()
export class UserService {
    
    async register(newUser: RegisterDto): Promise<RegisterUserResponse> {
        const checkEmail = await User.findOne({where: {email: newUser.email}})

        if (checkEmail) {
            throw new HttpException(
                `User with email ${newUser.email} already exists.`,
                HttpStatus.BAD_REQUEST,
                )
        }

        const user = new User();
        user.email = newUser.email;;
        await user.save();

        return user;
    }

    async getOneUser(id: string): Promise<User> {
        return await User.findOne({where: {id: id}})
    }
}