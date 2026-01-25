import { execSync } from 'node:child_process'
import * as dotenv from 'dotenv'
import { join } from 'node:path'

export const setupPrismaTests = () => {
  dotenv.config({ path: join(process.cwd(), '.env.test') })
  execSync('npx dotenv-cli -e .env.test -- npx prisma migrate deploy')

  // Gera o client novamente para garantir que ele está atualizado com o schema do teste
  execSync('npx prisma generate')
}
