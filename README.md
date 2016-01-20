LiveBy/winston-email
====================

Email transport logging for [winston] using [nodemailer], providing buffering
and fully-configurable message transports including [xoauth2] for Gmail and 
Google Apps for Work.


Install
------

```
$ npm install LiveBy/winston-email
```


Usage
-----

Add an email option to your logger, configured with to/from, and a [NodeMailer transport]

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

logger.info("info msg", {title:'optional title'});
```

Gmail OAuth
-----------

Use the [Google Developers Console] and the [OAuth2 Playground] to 
[obtain access and refresh tokens] for the Google auth user.


Test
----

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
