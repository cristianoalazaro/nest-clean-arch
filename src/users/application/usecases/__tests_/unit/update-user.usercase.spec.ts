import { UserEntity } from 'src/users/domain/entities/user.entity'
import { UpdateUserUseCase } from '../../update-user.usercase'
import { UserInMemoryRepository } from 'src/users/infrastructure/database/in-memory/repositories/user-in-memory-repository'
import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'
import { BadRequestError } from 'src/shared/application/errors/bad-request-error'
import { NotFoundError } from 'src/shared/infrastructure/domain/errors/not-found-error'

describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdateUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new UpdateUserUseCase.UseCase(repository)
  })

  it('Should throw an error when an entity is not found', async () => {
    expect(sut.execute({ id: 'fakeId', name: 'Some Name' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('Should throw an error when the name is not provided', async () => {
    expect(sut.execute({ id: 'someId', name: null as any })).rejects.toThrow(
      new BadRequestError('Name not provided'),
    )
  })

  it('Should update a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    repository.items = [entity]
    const spyUpdate = jest.spyOn(repository, 'update')
    const result = await sut.execute({ id: entity.id, name: 'New Name' })
    expect(spyUpdate).toHaveBeenCalled()
    expect(repository.items[0].name).toStrictEqual('New Name')
  })
})
