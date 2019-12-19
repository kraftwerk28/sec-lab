if (process.env.NODE_ENV === 'development') {
  const { resolve } = require('path');
  require('dotenv').config({ path: resolve(__dirname, '../../', '.env') });
}
