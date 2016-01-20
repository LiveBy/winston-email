LiveBy/winston-email
====================

Email transport logging for [winston] using [nodemailer], providing buffering
and fully-configurable message transports including [xoauth2] for Gmail and 
Google Apps for Work.


Install
------

```sh
npm install LiveBy/winston-email
```


Usage
-----

Add an email option to your logger, configured with `send.to`/`send.from`, and a [NodeMailer transport].

```javascript
var logger = require('winston')
var Email = require('winston-email')

logger.add(Email, {
  send: {
    to: env.EMAIL_TO,
    from: env.EMAIL_FROM
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
  level: 'error'
})
logger.info("Above, we configured Email transport for error, so this message won't be logged.")
try {
  doSomethingRisky()
} catch (error) {
  logger.error('Bad things happened...')
  logger.error(error)
  logger.info('👆 should trigger an email containing both 'error' level logs.')
}
```


transport
---------

The `transport` property will be passed directly to 
[`nodemailer.createTransport(options[, defaults])`](https://github.com/nodemailer/nodemailer#setting-up),
so you can use any transport supported by NodeMailer. If you are only using SMTP
authentication, you are welcome to just set the `user` and `pass`, or set `transport`
to be a smtp connection string.

```js
logger.add(Email, {
  send: { to: env.EMAIL_TO, from: env.EMAIL_FROM },
  transport: {
    service: 'gmail',
    auth: {
      user: env.EMAIL_FROM,
      pass: env.GMAIL_CREDENTIALS
    }
  },
  level: 'error'
})
```

Alternatively you could use an smtp connection url:

```js
logger.add(Email, {
  send: { to: 'user@example.com', from: 'user@example.com' },
  transport: 'smtps://user%40example.com:pass@mail.messagingengine.com:465',
  level: 'error'
})
```

If you are using Gmail, be sure you have 
[enabled POP and IMAP](https://mail.google.com/mail/u/0/#settings/fwdandpop) for your
account.

#### Gmail OAuth

Use the [Google Developers Console] and the [OAuth2 Playground] to 
[obtain access and refresh tokens] for the Google auth user.



send
----

The `send` property is passed to 
[`transport.sendMail(data)`](https://github.com/nodemailer/nodemailer#sending-mail) 
along with the log message text, so you are welcome to set additional fields like 
`sender`, `replyTo`, or `priority`. See NodeMailer's 
[E-mail message fields](https://github.com/nodemailer/nodemailer#e-mail-message-fields)
for additional options.


Test
----

Test with Google OAuth API credentials:

```sh
EMAIL_TO=<youremail> EMAIL_FROM=<youremail> GMAIL_APP_CLIENT_ID=<clientid> GMAIL_APP_CLIENT_SECRET=<clientsecret> GMAIL_APP_REFRESH_TOKEN=<refreshtoken> GMAIL_APP_ACCESS_TOKEN=<accesstoken> node test
```

[winston]: https://github.com/winstonjs/winston
[transport]: https://github.com/winstonjs/winston/blob/master/docs/transports.md

[nodemailer]: https://github.com/andris9/nodemailer
[xoauth2]: https://github.com/andris9/xoauth2#readme
[nodemailer transport]: https://github.com/nodemailer/nodemailer#setting-up

[Google Developers Console]: https://console.developers.google.com
[OAuth2 Playground]: https://developers.google.com/oauthplayground/
[Obtain access and refresh tokens]: http://stackoverflow.com/questions/24098461/nodemailer-gmail-what-exactly-is-a-refresh-token-and-how-do-i-get-one#answer-24123550


License
-------
ISC
