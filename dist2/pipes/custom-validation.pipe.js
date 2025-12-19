"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CustomValidationPipe_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let CustomValidationPipe = CustomValidationPipe_1 = class CustomValidationPipe {
    constructor() {
        this.logger = new common_1.Logger(CustomValidationPipe_1.name);
    }
    async transform(value, { metatype }) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        this.logger.debug(`Validating value: ${JSON.stringify(value)}`);
        const object = (0, class_transformer_1.plainToClass)(metatype, value);
        const errors = await (0, class_validator_1.validate)(object);
        if (errors.length > 0) {
            this.logger.error(`Validation failed: ${JSON.stringify(errors, null, 2)}`);
            const messages = errors.map((err) => {
                const property = err.property;
                const constraints = err.constraints
                    ? Object.values(err.constraints).join(', ')
                    : 'Invalid value';
                const value = err.value !== undefined ? `'${err.value}'` : 'undefined';
                return `Property '${property}' with value ${value}: ${constraints}`;
            });
            throw new common_1.BadRequestException({
                message: 'Validation failed',
                details: messages.join('; '),
                errors: errors.map((err) => ({
                    property: err.property,
                    value: err.value,
                    constraints: err.constraints,
                })),
            });
        }
        return object;
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
};
exports.CustomValidationPipe = CustomValidationPipe;
exports.CustomValidationPipe = CustomValidationPipe = CustomValidationPipe_1 = __decorate([
    (0, common_1.Injectable)()
], CustomValidationPipe);
//# sourceMappingURL=custom-validation.pipe.js.map