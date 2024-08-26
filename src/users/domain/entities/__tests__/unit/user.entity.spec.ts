import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-buil";
import { UserEntity, UserProps } from "../../user.entity"

describe('User entity unit tests', () => {
  let props: UserProps;
  let sut: UserEntity;

  beforeEach(() => {
    props = UserDataBuilder({});
    sut = new UserEntity(props)
  })

  it('constructor method', () => {
    expect(sut.props.name).toEqual(props.name)
    expect(sut.props.email).toEqual(props.email)
    expect(sut.props.password).toEqual(props.password)
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  it('Getter of name field', () => {
    expect(sut.props.name).toBeDefined()
    expect(sut.props.name).toEqual(props.name)
    expect(typeof sut.props.name).toBe("string")
  })

  it('Setter name field', () => {
    sut['name'] = 'other name'
    expect(sut.props.name).toEqual('other name')
  })

  it('Getter of email field', () => {
    expect(sut.props.email).toBeDefined()
    expect(sut.props.email).toEqual(props.email)
    expect(typeof sut.props.email).toBe("string")
  })

  it('Getter of password field', () => {
    expect(sut.props.password).toBeDefined()
    expect(sut.props.password).toEqual(props.password)
    expect(typeof sut.props.password).toBe("string")
  })

  it('Setter password field', () => {
    sut['password'] = '123456'
    expect(sut.props.password).toEqual('123456')
  })

  it('Getter of createdAt field', () => {
    expect(sut.props.createdAt).toBeDefined()
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  it('should update the name field', () => {
    sut.updateName('other name')
    expect(sut.props.name).toEqual('other name')
  })

  it('should update the password field', () => {
    sut.updateName('456789')
    expect(sut.props.name).toEqual('456789')
  })
})