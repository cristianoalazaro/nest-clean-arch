import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserOutputMapper } from '../../user-output'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'

describe('UserOutputMapper unit tests', () => {
  it('Should convert an entity to a UserOutput', () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const spyToJson = jest.spyOn(entity, 'toJSON')
    const sut = UserOutputMapper.toOutput(entity)

    expect(sut).toStrictEqual(entity.toJSON())
    expect(spyToJson).toHaveBeenCalled()
  })
})
