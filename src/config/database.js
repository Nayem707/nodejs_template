import { PrismaClient } from '@prisma/client'
import logger from '../utils/logger.js'

/**
 * Database configuration and connection setup
 *
 * This module creates and exports a singleton Prisma client instance
 * with proper error handling and logging for database operations.
 */

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    },
    {
      emit: 'event',
      level: 'error'
    },
    {
      emit: 'event',
      level: 'info'
    },
    {
      emit: 'event',
      level: 'warn'
    }
  ]
})

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', e => {
    logger.debug('Query: ' + e.query)
    logger.debug('Params: ' + e.params)
    logger.debug('Duration: ' + e.duration + 'ms')
  })
}

// Log database errors
prisma.$on('error', e => {
  logger.error('Database error:', e)
})

// Graceful shutdown
process.on('beforeExit', async () => {
  logger.info('Disconnecting from database...')
  await prisma.$disconnect()
})

export default prisma
