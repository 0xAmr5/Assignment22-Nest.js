import { 
  ValidatorConstraint, 
  ValidatorConstraintInterface, 
  ValidationArguments, 
  ValidationOptions, 
  registerDecorator 
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOne', async: false })
export class AtLeastOneConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    const properties = args.constraints as string[];
    
    return properties.some((property) => {
      const propertyValue = object[property];
      return propertyValue !== undefined && propertyValue !== null && propertyValue !== '';
    });
  }

  defaultMessage(args: ValidationArguments) {
    const properties = args.constraints as string[];
    return `At least one of the following fields must be provided: ${properties.join(', ')}`;
  }
}

export function AtLeastOne(properties: string[], validationOptions?: ValidationOptions) {
  return function (target: any, propertyKey?: string) {
    if (propertyKey) {
      // Property decorator
      registerDecorator({
        target: target.constructor,
        propertyName: propertyKey,
        options: validationOptions,
        constraints: properties,
        validator: AtLeastOneConstraint,
      });
    } else {
      // Class decorator
      registerDecorator({
        target: target,
        propertyName: '',
        options: validationOptions,
        constraints: properties,
        validator: AtLeastOneConstraint,
      });
    }
  };
}
