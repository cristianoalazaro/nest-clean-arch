import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { DeleteUserUseCase } from '../../deleteUser.usecase'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'

describe('DeleteUserUseCase unit tests', () => {
  let sut: DeleteUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new DeleteUserUseCase.UseCase(repository)
  })

  it('Should delete a user', async () => {
    const spyDeleteMethod = jest.spyOn(repository, 'delete')
    const entity = new UserEntity(UserDataBuilder({}))
    repository.items = [entity]

    await sut.execute({ id: entity.id })
    expect(repository.items).toHaveLength(0)
    expect(spyDeleteMethod).toHaveBeenCalledTimes(1)
  })

  it('Should throw an error when the id was not provided', async () => {
    await expect(sut.execute({ id: '' })).rejects.toThrow(new BadRequestError('Id not provided!'))
  })

  it('Should throw an error when the entity is not found', async () => {
    await expect(sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('Entity not found!'),
    )
  })
})
