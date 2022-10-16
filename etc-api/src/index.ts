import * as express from 'express'
import './env'
import './db'
import * as middleware from './middleware'
import * as errorHandling from './errorHandling'
import * as router from './router'

const { PORT } = process.env // default port to listen
const app = express()

/**
 * Middleware
 */
middleware.initialize(app)

/**
 * Routing
 */
router.initialize(app)

/**
 * Error Handling
 */
errorHandling.initialize(app)

// Start the express server
app.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`Etc API running on port: ${PORT}`)
})
