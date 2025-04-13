import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { UserProps } from '../entities/user.entity'
import { ClassValidatorFields } from 'src/shared/infrastructure/env-config/domain/validators/class-validator-fields'

export class UserRules {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string

  @IsDate()
  @IsOptional()
  createdAt?: string

  constructor({ name, email, password, createdAt }: UserProps) {
    Object.assign(this, { name, email, password, createdAt })
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserProps): boolean {
    return super.validate(new UserRules(data ?? {}))
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator()
  }
}
