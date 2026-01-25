import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter'
import { UserPresenter } from './user.presenter'
import { ListUserUseCase } from '@/users/application/usecases/listUser.usecase'
import { UsersController } from '../users.controller'

export class UserCollectionPresenter extends CollectionPresenter {
  data: UserPresenter[]

  constructor(output: ListUserUseCase.Output) {
    const { items, ...paginationProps } = output

    super(paginationProps)
    this.data = items.map(item => new UserPresenter(item))
  }
}
