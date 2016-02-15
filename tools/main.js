import { json as apiRequestParser } from 'body-parser'
import chalk from 'chalk'
import { createServer } from 'http'
import express from 'express'
import logger from 'morgan'

import apiServer from './features/api'

const app = express()
const server = createServer(app)

app.use(apiRequestParser())
app.use(logger('dev'))

app.use('/api/v1', apiServer)

server.listen(process.env.PORT || 3001, () => {
  console.log(
    chalk`{green 👍  API server listening on} {cyan.underline http://localhost:${
      server.address().port
    }}`,
    '\n'
  )
})
