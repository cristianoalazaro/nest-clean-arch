import { UserInMemoryRepository } from 'src/users/infrastructure/database/in-memory/repositories/user-in-memory-repository'
import { DeleteUserUseCase } from '../../delete-user.usecase'
import { BadRequestError } from 'src/shared/application/errors/bad-request-error'
import { NotFoundError } from 'src/shared/infrastructure/domain/errors/not-found-error'
import { UserEntity } from 'src/users/domain/entities/user.entity'
import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'

describe('DeleteUserUseCase unit tests', () => {
  let sut: DeleteUserUseCase.UseCase
  let userRepository: UserInMemoryRepository

  beforeEach(() => {
    userRepository = new UserInMemoryRepository()
    sut = new DeleteUserUseCase.UseCase(userRepository)
  })

  it('Should throw an error when id is not provided', async () => {
    expect(sut.execute({ id: null as any })).rejects.toThrow(
      new BadRequestError('Id not provided'),
    )
  })

  it('Should throw an error when entity is not found', async () => {
    expect(sut.execute({ id: 'testeId' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('Should delete a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    userRepository.items = [entity]
    const spyDelete = jest.spyOn(userRepository, 'delete')

    expect(userRepository.items).toHaveLength(1)
    await sut.execute({ id: entity._id })
    expect(userRepository.items).toHaveLength(0)
    expect(userRepository.delete).toHaveBeenCalledTimes(1)
  })
})
