import { Router } from "express";
import * as BotController from "../controllers/BotController"

const botRouter = Router();

botRouter.get('/', BotController.getAll );

botRouter.post('/', BotController.create );

botRouter.get('/:id', BotController.getAll );

botRouter.put('/:id', BotController.getAll );

botRouter.delete('/:id', BotController.del );

export default botRouter;