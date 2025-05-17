import { UserEntity } from 'src/users/domain/entities/user.entity'
import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'
import { UserOutputMapper } from '../../user-output'

describe('UserOutputMapper unit tests', () => {
  it('Should convert user in output', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const spyToJson = jest.spyOn(entity, 'toJson')
    const sut = UserOutputMapper.toOuput(entity)

    expect(spyToJson).toHaveBeenCalled()
    expect(sut).toStrictEqual(entity.toJson())
  })
})
