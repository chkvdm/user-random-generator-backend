import express from 'express';
import UsersController from './controllers/usersController.js';
const router = express.Router();
const usersController = new UsersController();

router.get('/', usersController.getUsers);

export default router;
