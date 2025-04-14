import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Logger } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  private readonly logger = new Logger(CustomValidationPipe.name);

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Log the incoming value for debugging
    this.logger.debug(`Validating value: ${JSON.stringify(value)}`);

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      // Log detailed validation errors
      this.logger.error(`Validation failed: ${JSON.stringify(errors, null, 2)}`);

      // Create a readable error message with constraints
      const messages = errors.map(err => {
        const property = err.property;
        const constraints = err.constraints ? Object.values(err.constraints).join(', ') : 'Invalid value';
        const value = err.value !== undefined ? `'${err.value}'` : 'undefined';
        return `Property '${property}' with value ${value}: ${constraints}`;
      });

      throw new BadRequestException({
        message: 'Validation failed',
        details: messages,
        errors: errors.map(err => ({
          property: err.property,
          value: err.value,
          constraints: err.constraints
        }))
      });
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}