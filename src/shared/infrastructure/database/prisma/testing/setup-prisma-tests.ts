import { execSync } from 'node:child_process'

export const setupPrismaTests = () => {
  execSync('npx dotenv-cli -e .env.test -- npx prisma migrate deploy')
}
