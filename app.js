import express from 'express';
import makeStoppable from 'stoppable';
import http from 'http';
import cors from 'cors';
import router from './routes/router.js';

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', router);

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

const server = makeStoppable(http.createServer(app));

function startServer() {
  const stopServer = () => {
    return new Promise((resolve) => {
      server.stop(resolve);
    });
  };

  return new Promise((resolve) => {
    server.listen(process.env.PORT || 3001, () => {
      console.log(`Server is running on ${process.env.PORT || 3001}`);
      resolve(stopServer);
    });
  });
}

startServer();
