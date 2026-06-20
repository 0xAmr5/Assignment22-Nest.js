import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserModel } from "../../../DB/models/user.model";
import UserRepository from "../../../DB/repository/user.repository";

@Module({
    imports: [UserModel],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [],
})
export class UserModule {}