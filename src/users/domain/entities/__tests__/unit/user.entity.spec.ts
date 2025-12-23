import { UserEntity, UserProps } from '../../user.entity'
import { UserDataBuilder } from '../testing/helpers/user-data-builder'

describe('UserEntity unit tests', () => {
  let props: UserProps
  let sut: UserEntity

  beforeEach(() => {
    UserEntity.validate = jest.fn()
    props = UserDataBuilder({})
    sut = new UserEntity(props)
  })

  it('Constructor method', () => {
    expect(UserEntity.validate).toHaveBeenCalledTimes(1)
    expect(UserEntity.validate).toHaveBeenCalledWith(props)
    expect(sut.props.name).toEqual(props.name)
    expect(sut.props.email).toEqual(props.email)
    expect(sut.props.password).toEqual(props.password)
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  it('Getter of name field', () => {
    expect(sut.name).toBeDefined()
    expect(sut.name).toEqual(props.name)
    expect(typeof sut.name).toBe('string')
  })

  it('Getter of email field', () => {
    expect(sut.email).toBeDefined()
    expect(sut.email).toEqual(props.email)
    expect(typeof sut.email).toBe('string')
  })

  it('Getter of password field', () => {
    expect(sut.password).toBeDefined()
    expect(sut.password).toEqual(props.password)
    expect(typeof sut.password).toBe('string')
  })

  it('Getter of createdAt field', () => {
    expect(sut.createdAt).toBeDefined()
    expect(sut.createdAt).toBeInstanceOf(Date)
  })

  it('Setter of name field', () => {
    const updatedName = 'Test Update Name'
    sut['name'] = updatedName

    expect(sut.props.name).toStrictEqual(updatedName)
  })

  it('Setter of password field', () => {
    const updatedpassword = '123123'
    sut['password'] = updatedpassword

    expect(sut.props.password).toStrictEqual(updatedpassword)
  })

  it('Should update the name of the field', () => {
    const updatedName = 'Test Update Name'
    sut.updateName(updatedName)

    expect(sut.props.name).toStrictEqual(updatedName)
    expect(UserEntity.validate).toHaveBeenCalledTimes(2)
    expect(UserEntity.validate).toHaveBeenCalledWith({
      ...props,
      name: updatedName,
    })
  })

  it('Should update the password of the field', () => {
    const updatedPassword = '123456'
    sut.updatePassword(updatedPassword)

    expect(sut.props.password).toStrictEqual(updatedPassword)
    expect(UserEntity.validate).toHaveBeenCalledTimes(2)
    expect(UserEntity.validate).toHaveBeenCalledWith({
      ...props,
      password: updatedPassword,
    })
  })
})
