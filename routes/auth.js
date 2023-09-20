const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  login, createUser,
} = require('../controllers/users');
const regex = require('../utils/regex');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

module.exports = router;