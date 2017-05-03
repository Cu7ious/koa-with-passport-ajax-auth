const mongoose = require('mongoose')
const crypto = require('crypto')
// const _ = require('lodash')
const config = require('config')

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: 'Username is missing'
  },
  email: {
    type: String,
    unique: true,
    required: 'E-mail must be set',
    validate: [
      {
        validator: function checkEmail (value) {
          return this.deleted ? true : /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value)
        },
        msg: 'Email is not valid'
      }
    ]
  },
  deleted: Boolean,
  passwordHash: {
    type: String,
    required: true
  },
  salt: {
    required: true,
    type: String
  }
}, {
  timestamps: true
})

userSchema.methods.getPublicFields = function() {
  return {
    displayName: this.displayName,
    email: this.email
  }
}

userSchema.virtual('password')
  .set(function(password) {

    if (password !== undefined) {
      if (password.length < 4) {
        this.invalidate('password', 'Password should be at least 4 symbols')
      }
    }

    this._plainPassword = password

    if (password) {
      this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64')
      this.passwordHash = crypto.pbkdf2Sync(
        password, this.salt, config.crypto.hash.iterations,
        config.crypto.hash.length, 'sha1'
      )
    } else {
      // remove password (unable to login w/ password any more, but can use providers)
      this.salt = undefined
      this.passwordHash = undefined
    }
  })
  .get(function() {
    return this._plainPassword
  })

userSchema.methods.checkPassword = function(password) {
  if (!password) return false // empty password means no login by password
  if (!this.passwordHash) return false // this user does not have password (the line below would hang!)

  return crypto.pbkdf2Sync(
      password, this.salt, config.crypto.hash.iterations,
      config.crypto.hash.length, 'sha1'
    ) == this.passwordHash
}

module.exports = mongoose.model('User', userSchema)
