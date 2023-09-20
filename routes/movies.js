const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovie, deleteMovie
} = require('../controllers/movies');
const regex = require('../utils/regex');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    link: Joi.string().pattern(RegExp(regex)).required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(RegExp(regex)).required(),
    trailerLink: Joi.string().pattern(RegExp(regex)).required(),
    thumbnail: Joi.string().pattern(RegExp(regex)).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().required().length(24),
  }),
}), deleteMovie);

module.exports = router;
