var util = require('util')
var winston = require('winston')
var Transport = winston.Transport
var nodemailer = require('nodemailer')
var exception = winston.exception

/**
 * module exports
 */

module.exports = winston.transports.Email = Email

/**
 * default options
 */
Email.defaults = {
  bufferTimeout: 100,
  tags: ['winston-email'],
  extendedError: false
}

/**
 * Email transport constructor
 */
function Email (options) {
  Transport.apply(this, arguments)

  if (!(options && options.send && options.send.to && options.send.from && options.transport)) {
    throw new Error('winston-email: "send.to", "send.from", and "transport" are required.')
  }

  var config = this.config = Object.assign({}, Email.defaults, options)

  this.transport = nodemailer.createTransport(config.transport)
  this.tags = config.tags.map(function (tag) {
    return '[' + tag + ']'
  }).join(' ')

  // Unset subject and message list
  this.buffer = []
  this.callbacks = []
}

util.inherits(Email, Transport)
Email.prototype.name = 'email'

Email.prototype.log = function (level, msg, meta, cb) {
  if (this.silent) return cb(null, true)

  var prefix = '[' + level + '] [' + Date() + '] '

  if (msg) {
    this.buffer.push(prefix + msg)
  }

  if (meta instanceof Error) {
    var errorInfo = exception.getAllInfo(meta)
    this.buffer.push(prefix + (errorInfo.stack || [String(meta)]).join('\n'))

    if (this.config.extendedError) {
      this.buffer.push(prefix + JSON.stringify(errorInfo, null, 2))
    }
  }

  this.callbacks.push(cb)

  clearTimeout(this.timeout)
  this.timeout = setTimeout(function (email) {
    email.flush()
  }, this.config.bufferTimeout, this)
}

Email.prototype.flush = function flush () {
  if (this.buffer.length) {
    var subject = this.tags + ' ' + (this.buffer[0] || '').slice(0, 51)
    var logs = this.buffer.slice().join('\n')
    var callbacks = this.callbacks.slice()

    this.transport.sendMail(Object.assign({}, this.config.send, {
      subject: subject,
      text: logs
    }), function (err, res) {
      callbacks.forEach(function (cb) {
        cb(err, res)
      })
    })
  }

  this.subject = ''
  this.buffer.length = 0
  this.callbacks.length = 0
}
