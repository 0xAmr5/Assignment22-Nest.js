

import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { GenderEnum, RoleEnum } from "../../common/enum/user.enum";
import { HydratedDocument } from "mongoose";
import { Hash } from "../../common/utils/security/hash";

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})
export class User {

    @Prop({ type: String, required: true, min: 5 })
    userName: string;

    @Prop({ type: String, required: true, unique: true })
    email: string;

    @Prop({ type: String, required: true, trim: true })
    password: string;

    @Prop({ type: String, trim: true })
    phone: string;

    @Prop({ type: Number, min: 18, max: 60 })
    age: number;

    @Prop({ type: String, trim: true })
    address?: string;

    @Prop({ type: String, trim: true })
    profilePic?: string;

    @Prop({ type: String, enum: GenderEnum, default: GenderEnum.Male })
    gender?: GenderEnum;

    @Prop({ type: String, enum: RoleEnum, default: RoleEnum.User })
    role?: RoleEnum;

}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', function () {
    console.log(this);
    if (this.isModified("password")) {
        this.password = Hash({ plain_text: this.password })
    }
});
export type HUserDocument = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])