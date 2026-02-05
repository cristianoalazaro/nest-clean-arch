import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contract'
import { ListUserUseCase } from '@/users/application/usecases/listUser.usecase'
import { IsOptional } from 'class-validator'

export class ListUsersDto implements ListUserUseCase.Input {
  @IsOptional()
  page?: number

  @IsOptional()
  perPage?: number

  @IsOptional()
  sort?: string | null

  @IsOptional()
  sortDir?: SortDirection | null

  @IsOptional()
  filter?: string
}
