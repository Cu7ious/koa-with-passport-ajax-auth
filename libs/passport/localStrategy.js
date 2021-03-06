let passport = require('koa-passport')
let LocalStrategy = require('passport-local')
let User = require('../../models/user')

// This strategy gets fields from req.body
// then calls function for them
passport.use(new LocalStrategy({
    usernameField: 'email', // 'username' by default
    passwordField: 'password',
    passReqToCallback: true // all strategies support ctx: req for more complex cases
  },
  // Three possible ends / Три возможных итога функции
  // done(null, user[, info]) ->
  //   strategy.success(user, info)
  // done(null, false[, info]) ->
  //   strategy.fail(info)
  // done(err) ->
  //   strategy.error(err)
  function (req, email, password, done) {
    User.findOne({ email }, function(err, user) {
      if (err) {
        return done(err)
      }

      if (!user || !user.checkPassword(password)) {
        // don't say whether the user exists
        return done(null, false, { message: 'User does not exist or password is incorrect' })
      }
      return done(null, user)
    })
  }
))
