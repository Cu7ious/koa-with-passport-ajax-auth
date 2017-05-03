const oid = require('../libs/oid')
require('../models/user')

exports.User = [{
  _id:      oid('user-mk'),
  email:    'ask@cu7io.us',
  displayName: 'mk',
  password: '123456'
}, {
  _id:      oid('user-iliakan'),
  email:    'contact@cu7io.us',
  displayName: 'iliakan',
  password: '123456'
}]
