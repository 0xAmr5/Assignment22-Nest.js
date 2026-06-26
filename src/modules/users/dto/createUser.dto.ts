import { 
  Allow, IsEmail, IsInt, IsNotEmpty, IsString, IsStrongPassword, 
  Length, registerDecorator, Validate, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface 
} from "class-validator";

@ValidatorConstraint({ name: 'matchKey', async: false })
export class matchKey implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    console.log({ value, args });
    console.log(args.value, args.object[args.constraints[0]]);
    return value === args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} not match with ${args.constraints[0]}`;
  }
}

export function IsMatch(constraints: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: constraints,
      validator: matchKey,
    });
  };
}

export class CreateUserDto {

  @IsNotEmpty()
  @IsString({ message: "name must be string..." })
  @Length(3, 15, { message: "name is too short" })
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsInt()
  age: number;
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsMatch(["password"])
  cPassword: string;
}

export class signInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export type signUpDto = CreateUserDto;
