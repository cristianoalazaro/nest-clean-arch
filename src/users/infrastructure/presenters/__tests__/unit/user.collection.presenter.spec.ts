import { ListUserUseCase } from '@/users/application/usecases/listUser.usecase'
import { UserCollectionPresenter } from '../../user.collection.presenter'
import { UserOutput } from '@/users/application/dtos/user-output'
import { UserPresenter } from '../../user.presenter'
import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter'
import { instanceToPlain, plainToInstance } from 'class-transformer'

describe('UserCollectionPresenter unit tests', () => {
  const createdAt = new Date()

  const props: UserOutput = {
    id: 'cd36e9a9-bdb6-42bd-a960-121475915524',
    name: 'Test Name',
    email: 'test@test.com',
    password: '123456',
    createdAt,
  }

  it('Should set values', () => {
    const sut = new UserCollectionPresenter({
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
      total: 1,
    })

    expect(sut.data).toStrictEqual([new UserPresenter(props)])
    expect(sut.meta).toBeInstanceOf(PaginationPresenter)
    expect(sut.meta).toStrictEqual(
      new PaginationPresenter({
        currentPage: 1,
        lastPage: 1,
        perPage: 2,
        total: 1,
      }),
    )
  })

  it('Should presenter data', () => {
    const sut = new UserCollectionPresenter({
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
      total: 1,
    })

    const output = instanceToPlain(sut)

    expect(output).toStrictEqual({
      data: [
        {
          id: 'cd36e9a9-bdb6-42bd-a960-121475915524',
          name: 'Test Name',
          email: 'test@test.com',
          createdAt: createdAt.toISOString(),
        },
      ],
      meta: {
        currentPage: 1,
        lastPage: 1,
        perPage: 2,
        total: 1,
      },
    })
  })
})
