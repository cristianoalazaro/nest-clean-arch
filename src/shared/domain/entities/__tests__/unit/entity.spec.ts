import { Entity } from '../../entity'

type StubProps = {
  prop1: string
  prop2: number
}

function uuidValidate(uuid: string): boolean {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i
  return regex.test(uuid)
}

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  const props: StubProps = { prop1: 'value 1', prop2: 15 }

  it('Should set props and id', () => {
    const entity = new StubEntity(props)

    expect(entity.props).toStrictEqual(props)
    expect(entity._id).not.toBeNull()
    expect(uuidValidate(entity._id)).toBeTruthy()
  })

  it('Shold accept a valid id', () => {
    const id = 'f3322b33-6be1-4e37-bbf3-8698dcbe709e'
    const entity = new StubEntity(props, id)

    expect(uuidValidate(id)).toBeTruthy()
    expect(entity._id).toStrictEqual(id)
  })

  it('Should convert an entity to a JSON', () => {
    const id = 'f3322b33-6be1-4e37-bbf3-8698dcbe709e'
    const sut = new StubEntity(props, id)

    expect(sut.toJSON()).toStrictEqual({
      id,
      ...props,
    })
  })
})
