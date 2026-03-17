import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contract'
import { ListUserUseCase } from '@/users/application/usecases/listUser.usecase'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class ListUsersDto implements ListUserUseCase.Input {
  @ApiPropertyOptional({
    description: 'Página que será retornada',
  })
  @IsOptional()
  page?: number

  @ApiPropertyOptional({
    description: 'Quantidade de registros por página',
  })
  @IsOptional()
  perPage?: number

  @ApiPropertyOptional({
    description: 'Coluna definida para ordernar os dados: "name" ou "createdAt"',
  })
  @IsOptional()
  sort?: string | null

  @ApiPropertyOptional({
    description: 'Ordenação dos dados: "asc" ou "desc"',
  })
  @IsOptional()
  sortDir?: SortDirection | null

  @ApiPropertyOptional({
    description: 'Dado informado para filtro o resultado',
  })
  @IsOptional()
  filter?: string
}
