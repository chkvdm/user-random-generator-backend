import express from 'express';
import usersRouter from './users/usersRouter.js';

const router = express.Router();

router.use('/api/v1/users', usersRouter);

export default router;
