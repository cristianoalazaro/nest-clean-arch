import { UserEntity, UserProps } from '../../user.entity'
import { UserDataBuilder } from '../testing/helpers/user-data-builder'

describe('UserEntity unit tests', () => {
  let props: UserProps
  let sut: UserEntity

  beforeEach(() => {
    props = UserDataBuilder({})

    sut = new UserEntity(props)
  })

  it('Constructor method', () => {
    expect(sut.props.name).toEqual(props.name)
    expect(sut.props.email).toEqual(props.email)
    expect(sut.props.password).toEqual(props.password)
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  it('Getter of name field', () => {
    expect(sut.props.name).toBeDefined()
    expect(sut.props.name).toEqual(props.name)
    expect(typeof sut.props.name).toBe('string')
  })

  it('Getter of email field', () => {
    expect(sut.props.email).toBeDefined()
    expect(sut.props.email).toEqual(props.email)
    expect(typeof sut.props.email).toBe('string')
  })

  it('Getter of password field', () => {
    expect(sut.props.password).toBeDefined()
    expect(sut.props.password).toEqual(props.password)
    expect(typeof sut.props.password).toBe('string')
  })

  it('Getter of createdAt field', () => {
    expect(sut.props.createdAt).toBeDefined()
    expect(sut.props.createdAt).toBeInstanceOf(Date)
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
  })

  it('Should update the password of the field', () => {
    const updatedPassword = '123456'
    sut.updatePassword(updatedPassword)

    expect(sut.props.password).toStrictEqual(updatedPassword)
  })
})
