import express from 'express';
import { helloController } from '../controllers/hello.js';

const helloRoute = express.Router();

helloRoute.get('/api/hello', helloController);

export default helloRoute;
