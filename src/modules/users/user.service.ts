import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../../DB/models/user.model";
import { Model } from "mongoose";
import UserRepository from "../../DB/repository/user.repository";
import { CreateUserDto, signInDto } from "./dto/createUser.dto";
import { Hash } from "../../common/utils/security/hash";
import { encrypt } from "../../common/utils/security/encrypt.security";

@Injectable()
export class UserService {
    signIn(body: signInDto) {
        throw new Error('Method not implemented.');
    }

    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async getUsers() {
        return await this.userRepository.find();
    }

    async signUp(body: CreateUserDto) {
        const { age, cPassword, email, password, phone, userName } = body;

        const emailExist = await this.userRepository.findOne({
            filter: { email }
        });

        if (emailExist) throw new ConflictException("email already exist");

        const user = await this.userRepository.create({
            age,
            email,
            password: Hash({ plain_text: password }),
            phone: encrypt(phone),
            userName
        });

        return user;
    }

}