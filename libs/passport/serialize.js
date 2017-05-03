const User = require('../../models/user')
const passport = require('koa-passport')
// passport doesnt' operates directly to DB
passport.serializeUser(function(user, done) {
  done(null, user.id) // uses _id as idFieldd
})
passport.deserializeUser(function(id, done) {
  User.findById(id, done) // callback version checks id validity automatically
})
