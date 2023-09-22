require('dotenv').config();
const express = require('express');
const rateLimiter = require('./utils/rate-limiter')
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const router = require('./routes/router');
const cors = require('cors');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NODE_ENV, MONGO_ADDRESS, PORT = 3000 } = process.env;
const dbAddress = NODE_ENV === 'production' ? MONGO_ADDRESS : '127.0.0.1:27017'
const app = express();

app.use(rateLimiter);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(`mongodb://${dbAddress}/bitfilmsdb`);

app.use(requestLogger);

app.use(cors());

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res.status(err.statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

app.listen(PORT);
