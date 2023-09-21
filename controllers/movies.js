const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NoRightsError = require('../errors/no-rights-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({owner: req.user._id})
    .then((movies) => {
      res.send({ data: movies })
    })
    .catch((err) => 
        next(err)
    );  
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send({ _id: movie._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Невалидные параметры запроса'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Запрашиваемый фильм не найден'))
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        throw new NoRightsError('Вы не можете удалять фильмы других пользователей');
      } else {
        return Movie.findByIdAndRemove(req.params.movieId)
          .then((deletedMovie) => {
            res.send({ message: `Фильм ${deletedMovie._id} успешно удален` });
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Запрашиваемый фильм не найден, проверьте формат id'));
      } else {
        next(err);
      }
    });
};
