import { resolve } from 'path'
import { config } from 'dotenv'

if (process.env.NODE_ENV === 'development') {
  const path = resolve(process.cwd(), '../../', '.env')
  config({ path })
}
