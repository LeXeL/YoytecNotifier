let env = process.env.NODE_ENV || 'development'

if (env === 'development') {
  process.env.PORT = 3000
  process.env.MONGODB_URI = 'mongodb://localhost:27017/yoytecdb'
  process.env.WAIT_TIME = '10s'
  process.env.DEVELOPMENT = true
}
