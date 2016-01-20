var logger = require('winston')
var xoauth2 = require('xoauth2')
var Email = require('..')

var env = process.env

// Ensure environment variables are set.
checkEnv(env)

logger.add(Email, {
  send: {
    from: env.EMAIL_FROM,
    to: env.EMAIL_TO
  },
  transport: {
    service: 'gmail',
    auth: {
      xoauth2: xoauth2.createXOAuth2Generator({
        user: env.EMAIL_FROM,
        clientId: env.GMAIL_APP_CLIENT_ID,
        clientSecret: env.GMAIL_APP_CLIENT_SECRET,
        refreshToken: env.GMAIL_APP_REFRESH_TOKEN,
        accessToken: env.GMAIL_APP_ACCESS_TOKEN
      })
  }},
  tags: ['winston-email', 'test'],
  level: 'error',
  extendedError: true,

  // These options should work but currently don't :(
  json: true,
  handleExceptions: true,
  humanReadableUnhandledException: false,
  exitOnError: false
})

logger.info("Hello! Let's throw an error and see if the logger handles it!")

try {
  supercalifragilistic()
} catch(err) {
  logger.error('Caught error')
  logger.error(err)
  logger.error('Errors are %s', ' the worst')
  logger.info('Now check your email to see if you received something!')
  logger.info("The email should just have the 'error' messages, not these informational ones.")

  // Handling exceptions currently doesn't work :(
  //throw new Error('How do you like me now?')
}

function checkEnv (env) {
  var required = [
    'EMAIL_FROM',
    'EMAIL_TO',
    'GMAIL_APP_CLIENT_ID',
    'GMAIL_APP_CLIENT_SECRET',
    'GMAIL_APP_REFRESH_TOKEN',
    'GMAIL_APP_ACCESS_TOKEN'
  ]

  required.forEach(function (key) {
    if (!(key in env)) {
      throw new Error('The following environment variables must be set: ' + required.join(' '))
    }
  })
}
