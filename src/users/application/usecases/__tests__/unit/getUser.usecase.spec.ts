import { UserInMemoryRepository } from '@/users/infrastructure/database/repository/user-in-memory.repository'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import { GetUserUseCase } from '../../getUser.usecase'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

describe('GetUserUseCase unit tests', () => {
  let sut: GetUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new GetUserUseCase.UseCase(repository)
  })

  it('Should find a user by id', async () => {
    const spyFindById = jest.spyOn(repository, 'findById')
    const props = [new UserEntity(UserDataBuilder({}))]

    repository.items = props

    const result = await sut.execute({ id: props[0].id })
    expect(result).toStrictEqual(props[0].toJSON())
    expect(spyFindById).toHaveBeenCalledTimes(1)
  })

  it('Should throw an error when a user is not found', async () => {
    await expect(sut.execute({ id: 'fake_id' })).rejects.toThrow(
      new NotFoundError('Entity not found!'),
    )
  })
})
