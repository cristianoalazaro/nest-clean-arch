import { UserInMemoryRepository } from 'src/users/infrastructure/database/in-memory/repositories/user-in-memory-repository'
import { ListUsersUseCase } from '../../listusers.usecase'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { UserEntity } from 'src/users/domain/entities/user.entity'
import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'

describe('ListUserUseCase unit tests', () => {
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
})
