import { resolve } from 'path'
import { config } from 'dotenv'

const DEV = process.env.NODE_ENV !== 'production'
const path = resolve(process.cwd(), DEV ? '.env.dev' : '.dev')
console.log('.env path:', path)
config({ path })
