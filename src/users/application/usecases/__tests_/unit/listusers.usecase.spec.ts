import { UserInMemoryRepository } from 'src/users/infrastructure/database/in-memory/repositories/user-in-memory-repository'
import { ListUsersUseCase } from '../../listusers.usecase'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { UserEntity } from 'src/users/domain/entities/user.entity'
import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'

describe('ListUsersUseCase unit tests', () => {
  let repository: UserInMemoryRepository
  let sut: ListUsersUseCase.UseCase

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new ListUsersUseCase.UseCase(repository)
  })

  it('toOutput', () => {
    let result = new UserRepository.SearchResult({
      items: [],
      currentPage: 1,
      perPage: 2,
      total: 1,
      sort: null,
      sortDir: null,
      filter: null,
    })

    let output = sut['toOutput'](result)

    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    })

    const entity = new UserEntity(UserDataBuilder({}))

    result = new UserRepository.SearchResult({
      items: [entity],
      currentPage: 1,
      perPage: 2,
      total: 1,
      sort: null,
      sortDir: null,
      filter: null,
    })

    output = sut['toOutput'](result)

    expect(output).toStrictEqual({
      items: [entity.toJson()],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    })
  })

  it('Should return the users ordered by createdAt', async () => {
    const createdAt = new Date()

    const items = [
      new UserEntity(UserDataBuilder({ createdAt })),
      new UserEntity(
        UserDataBuilder({ createdAt: new Date(createdAt.getTime() + 1) }),
      ),
    ]

    repository.items = items
    const output = await sut.execute({})

    expect(output).toStrictEqual({
      items: [...items].reverse().map(item => item.toJson()),
      total: 2,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    })
  })

  it('Should return the users using pagination, sort and filter', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'a' })),
      new UserEntity(UserDataBuilder({ name: 'AA' })),
      new UserEntity(UserDataBuilder({ name: 'Aa' })),
      new UserEntity(UserDataBuilder({ name: 'b' })),
      new UserEntity(UserDataBuilder({ name: 'c' })),
    ]

    repository.items = items
    const output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    })

    expect(output).toStrictEqual({
      items: [items[1].toJson(), items[2].toJson()],
      total: 3,
      currentPage: 1,
      lastPage: 2,
      perPage: 2,
    })
  })
})
