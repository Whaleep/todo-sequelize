const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
// 差異點: 載入User model
const db = require('../models')
const User = db.User

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  // LocalStrategy
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    // 差異點: 查詢特定 email 的 User 用 where
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          req.flash('warning_msg', 'That email is not registered!')
          return done(null, false, { message: 'That email is not registered!' })
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              req.flash('warning_msg', 'Email or Password incorrect.')
              return done(null, false, { message: 'Email or Password incorrect.' })
            }
            return done(null, user)
          })
      })
      .catch(err => done(err, false))
  }))

  // Facebook Strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
    (accessToken, refreshToken, profile, done) => {
      const { name, email } = profile._json
      User.findOne({ where: { email } })
        .then(user => {
          if (user) return done(null, user)
          const randomPassword = Math.random().toString(36).slice(-8)
          bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => User.create({ name, email, password: hash }))
            .then(user => done(null, user))
            .catch(err => done(err, false))
        })
    }
  ))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    // 差異點: 查詢特定 id 的 User，用 findByPk
    User.findByPk(id)
      .then((user) => {
        // 差異點: 把 user 物件轉成 plain object 回傳給 req 繼續使用，用 toJSON()
        user = user.toJSON()
        done(null, user)
      }).catch(err => done(err, null))
  })
}

