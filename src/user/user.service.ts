import { Injectable } from "@nestjs/common";
import { RegisterUserResponse } from "src/interfaces/user";
import { RegisterDto } from "./dto/register.dto";
import { User } from "./user.entity";

@Injectable()
export class UserService {
    
    async register(newUser: RegisterDto): Promise<RegisterUserResponse> {
        const checkEmail = await User.findOne({where: {email: newUser.email}})

        if (checkEmail) {
            return {
                statusCode: 400,
                message: `User with email: ${newUser.email} already exists. Use another email address.`
            }
        }

        const user = new User();
        user.email = newUser.email;;
        await user.save();

        return user;
    }
}