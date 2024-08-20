import { validate as uuidValidate } from "uuid";
import { Entity } from "../../entity";

type StubProps = {
  prop1: string
  prop2: number
}

class Stub extends Entity<StubProps>{}

describe('Entity unit test', () => {
  it('should set props and id', () => {
    const props: StubProps = { prop1: 'value1', prop2: 10 }
    const entity = new Stub(props);

    expect(entity.props).toStrictEqual(props)
    expect(entity._id).not.toBeNull()
    expect(uuidValidate(entity._id)).toBeTruthy()
  })

  it('should accept a valid uuid', () => {
    const props: StubProps = { prop1: 'value1', prop2: 10 }
    const id = '70358b38-5969-495c-9cc5-7046edaad19d'
    const entity = new Stub(props, id)

    expect(entity._id).toEqual(id)
    expect(uuidValidate(entity._id)).toBeTruthy()
  })

  it('should convert an entity to a javascript object', () => {
    const props: StubProps = { prop1: 'value1', prop2: 10 }
    const id = '70358b38-5969-495c-9cc5-7046edaad19d'
    const entity = new Stub(props, id)

    expect(entity.toJson()).toEqual({
      id,
      ...props
    })
  })
})