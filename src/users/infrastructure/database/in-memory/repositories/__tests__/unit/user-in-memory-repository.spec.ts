import { NotFoundError } from 'src/shared/infrastructure/domain/errors/not-found-error'
import { UserInMemoryRepository } from '../../user-in-memory-repository'
import { UserEntity } from 'src/users/domain/entities/user.entity'
import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'
import { ConflictError } from 'src/shared/infrastructure/domain/errors/conflict-error'

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository

  beforeEach(() => {
    sut = new UserInMemoryRepository()
  })

  it('Should throw an error when not found - findByEmail method', async () => {
    await expect(sut.findByEmail('test@test.com')).rejects.toThrow(
      new NotFoundError('Entity not found using email test@test.com'),
    )
  })

  it('Should find an entity by email', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findByEmail(entity.email)
    expect(result.toJson()).toStrictEqual(entity.toJson())
  })

  it('Should throw an error when found an email - email exists method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError('Email address already used'),
    )
  })

  it('Should return void when an not find an email', async () => {
    expect.assertions(0)
    const result = await sut.emailExists('a@a.com')
  })

  it('Should no filter items when filter object is null', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findAll()
    const spyFilter = jest.spyOn(result, 'filter')
    const filteredItems = await sut['applyFilter'](result, null as any)
    expect(spyFilter).not.toHaveBeenCalled()
    expect(filteredItems).toStrictEqual(result)
  })

  it('Should filter name using filter param', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'TEST' })),
      new UserEntity(UserDataBuilder({ name: 'Test' })),
      new UserEntity(UserDataBuilder({ name: 'Fake' })),
    ]

    const spyFilter = jest.spyOn(items, 'filter')
    const filteredItems = await sut['applyFilter'](items, 'test')
    expect(spyFilter).toHaveBeenCalledTimes(1)
    expect(filteredItems).toStrictEqual([items[0], items[1]])
  })

  it('Should sort by createdAt when sort param is null ', async () => {
    const createdAt = new Date()

    const items = [
      new UserEntity(UserDataBuilder({ name: 'a', createdAt })),
      new UserEntity(
        UserDataBuilder({
          name: 'c',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),
      new UserEntity(
        UserDataBuilder({
          name: 'b',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
      ),
    ]

    const sortedItems = await sut['applySort'](items, null, null)
    expect(sortedItems).toStrictEqual([items[2], items[1], items[0]])
  })

  it('Should sort by name field ', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'a' })),
      new UserEntity(
        UserDataBuilder({
          name: 'c',
        }),
      ),
      new UserEntity(
        UserDataBuilder({
          name: 'b',
        }),
      ),
    ]

    let sortedItems = await sut['applySort'](items, 'name', null)
    expect(sortedItems).toStrictEqual([items[1], items[2], items[0]])

    sortedItems = await sut['applySort'](items, 'name', 'asc')
    expect(sortedItems).toStrictEqual([items[0], items[2], items[1]])
  })
})
