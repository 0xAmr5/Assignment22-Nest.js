import { Module, RequestMethod, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from '../../DB/models/user.model';
import UserRepository from '../../DB/repository/user.repository';
import { RedisService } from "../../service/redis.service";
import TokenService from "../../service/token.service";
import { JwtService } from "@nestjs/jwt";
import { MulterModule } from "@nestjs/platform-express";
import multer from "multer";
import type { Request } from "express";
import { logger } from '../../common/middleware/logger.middleware';

@Module({
    imports: [
        UserModel,
        MulterModule.register({
            storage: multer.diskStorage({
                destination: (req: Request, file: Express.Multer.File, cb: Function) => {
                    cb(null, "./uploads")
                },
                filename: (req: Request, file: Express.Multer.File, cb: Function) => {
                    cb(null, Date.now() + file.originalname)
                }
            })
        })
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        RedisService,
        TokenService,
        JwtService
    ],
    exports: [],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(logger)
            .exclude(
                { path: 'users/signUp', method: RequestMethod.POST },
            )
            .forRoutes(
                UserController
            )
    }
}