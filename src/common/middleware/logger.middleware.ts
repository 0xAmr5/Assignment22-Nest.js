import { Request, Response, NextFunction } from 'express';
import TokenService from 'src/service/token.service.js';

export function logger(req: Request, res: Response, next: NextFunction) {
    
    console.log('Request...');
    next();
};



// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import TokenService from 'src/service/token.service';

// @Injectable()
// export class Auth implements NestMiddleware {

//     constructor(
//         private readonly tokenService: TokenService,
//     ) {}

//     use(req: Request, res: Response, next: NextFunction) {
//         console.log(req.headers.authorization);
//         next();
//     }
// }