const router = require('express').Router();
const controller = require('./users.controller');
const methodNotAllowed = require("../utils/methodNotAllowed")

//user capabilities create a user and ///post request/// login, update password

//user/login route
///user/createuser//router.route('/:user_id/password').get(controller.read).put(controller.updateUserPassword)
router.route('/signup').post(controller.create).all(methodNotAllowed);

module.exports = router