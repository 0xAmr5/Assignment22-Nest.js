import { Body, Controller, Get, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { signInDto, signUpDto } from './dto/createUser.dto';
import { Auth } from '../../common/decorator/auth.decorator';
import { TokenEnum } from '../../common/enum/token.enum';
import { RoleEnum } from '../../common/enum/user.enum';
import { UserService } from './user.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    @Auth({ token_type: TokenEnum.access_token, access_roles: [RoleEnum.User] })
    getUsers(@Req() req: any) {
        console.log(req.user, req.decoded);
        return this.userService.getUsers();
    }

    @Post("signUp")
    signUp(@Body() body: signUpDto) {
        return this.userService.signUp(body);
    }

    @Post("signIn")
    signIn(@Body() body: signInDto) {
        return this.userService.signIn(body);
    }

    @Post("upload")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'avatar', maxCount: 2 },
        { name: 'background', maxCount: 1 },
    ]))
    getProfile(@UploadedFiles() files: { avatar?: Express.Multer.File[], background?: Express.Multer.File[] }) {
        return files
    }
}
