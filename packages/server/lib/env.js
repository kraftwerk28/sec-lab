import { resolve } from 'path'
import { config } from 'dotenv'
const path = resolve(process.cwd(), '../../', '.env')
config({ path })
