import { Injectable } from '@nestjs/common'
import { UpdateUserDto } from './dtos/update-user.dto'
import { SignUpDto } from './dtos/signUp.dto'
import { UpdatePasswordUserDto } from './dtos/updatePassword-user.dto'

@Injectable()
export class UsersService {
  create(signUpDto: SignUpDto) {
    return 'This action adds a new user'
  }

  findAll() {
    return `This action returns all users`
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  updatePassword(id: number, updatePasswordUserDto: UpdatePasswordUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
