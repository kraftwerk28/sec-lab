import { resolve } from 'path'
import { config } from 'dotenv'

const DEV = process.env.NODE_ENV !== 'production'
resolve(process.cwd(), DEV ? '.env.dev' : '.dev')
config()
