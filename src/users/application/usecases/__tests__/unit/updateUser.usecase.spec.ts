import { UserInMemoryRepository } from '@/users/infrastructure/database/repository/user-in-memory.repository'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { UpdateUserUseCase } from '../../updateUser.usecase'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

describe('SignUpUseCase unit tests', () => {
  let sut: UpdateUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new UpdateUserUseCase.UseCase(repository)
  })

  it('Should update a user name', async () => {
    const spyUpdateMethod = jest.spyOn(repository, 'update')
    const entity = new UserEntity(UserDataBuilder({}))
    repository.items = [entity]
    entity.updateName('test name')

    const result = await sut.execute(entity)
    expect(result.name).toStrictEqual(entity.name)
    expect(spyUpdateMethod).toHaveBeenCalledTimes(1)
  })

  it('Should throw an error when the name was not provided', async () => {
    await expect(sut.execute({ id: 'fakeId', name: '' })).rejects.toThrow(
      new BadRequestError('Name not provided!'),
    )
  })

  it('Should throw an error when the entity is not found', async () => {
    await expect(sut.execute({ id: 'fakeId', name: 'test name' })).rejects.toThrow(
      new NotFoundError('Entity not found!'),
    )
  })
})
