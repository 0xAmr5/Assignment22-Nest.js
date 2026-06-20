
import { PipeTransform, Injectable, ArgumentMetadata, HttpException } from "@nestjs/common";
import { ZodType } from "zod/v3";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodType) {}
  transform(value: any, metadata: ArgumentMetadata) {
    const {success, error} = this.schema.safeParse(value);
    if(!success) {
      throw new HttpException({
        message: 'Validation failed',
        errors: error.issues.map((issue) => 
        {
          return {
            message: issue.message,
            path: issue.path
          }
        }),
     }, 400);
    }
    return value;
  }
}

