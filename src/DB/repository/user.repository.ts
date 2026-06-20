import { BaseRepository } from "./base.repository";
import { User } from "../models/user.model";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

@Injectable()
class UserRepository extends BaseRepository<User> {

    constructor(@InjectModel(User.name) protected model: Model<User>) {
        super(model);
    }

}

export default UserRepository;