import { validate as uuidValidate } from 'uuid'
import { Entity } from '../../entity'

type Props = {
  prop1: string
  prop2: number
}

class StubEntity extends Entity<Props> {}

describe('Entity unit tests', () => {
  const props: Props = { prop1: 'value1', prop2: 123 }

  it('Should set props and id', () => {
    const entity = new StubEntity(props)

    expect(entity.props).toStrictEqual(props)
    expect(entity.id).not.toBeNull()
    expect(uuidValidate(entity.id)).toBeTruthy()
  })

  it('Should accept a valida uuid', () => {
    const id = '7ac9ed6c-358d-49ae-b77e-be79cc56d0fd'
    const entity = new StubEntity(props, id)

    expect(uuidValidate(entity.id)).toBeTruthy()
    expect(entity.id).toStrictEqual(id)
  })

  it('Should convert an entity to a javascript object', () => {
    const id = '7ac9ed6c-358d-49ae-b77e-be79cc56d0fd'
    const entity = new StubEntity(props, id)

    expect(entity.toJson()).toStrictEqual({
      id,
      ...props,
    })
  })
})
