import { UserOutput } from '@/users/application/dtos/user-output'
import { UserPresenter } from '../../user.presenter'
import { instanceToPlain } from 'class-transformer'

describe('UserPresenter unit tests', () => {
  let sut: UserPresenter
  const createdAt = new Date()

  const props: UserOutput = {
    id: 'cd36e9a9-bdb6-42bd-a960-121475915524',
    name: 'Test Name',
    email: 'test@test.com',
    password: '123456',
    createdAt,
  }

  beforeEach(() => {
    sut = new UserPresenter(props)
  })

  describe('Constructor', () => {
    it('Should be defined', () => {
      expect(sut.id).toEqual(props.id)
      expect(sut.name).toEqual(props.name)
      expect(sut.email).toEqual(props.email)
      expect(sut.createdAt).toEqual(props.createdAt)
    })
  })

  it('Should presenter data', () => {
    const output = instanceToPlain(sut)
    expect(output).toEqual({
      id: 'cd36e9a9-bdb6-42bd-a960-121475915524',
      name: 'Test Name',
      email: 'test@test.com',
      createdAt: props.createdAt.toISOString(),
    })
  })
})
