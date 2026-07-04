import { HydratedDocument, Model, Types } from "mongoose";
import BaseRepository from "./base.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Brand } from "../model/brand.model";

@Injectable()
class BrandRepository extends BaseRepository<Brand> {

    constructor(@InjectModel(Brand.name) protected model: Model<Brand>) {
        super(model)
    }

}

export default BrandRepository;