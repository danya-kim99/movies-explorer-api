const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regex = require('../utils/regex');
const {
  getMe, patchUser,
} = require('../controllers/users');

router.get('/me', getMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(2).max(30).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), patchUser);


module.exports = router;
