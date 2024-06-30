import { Router } from "express";
import * as BotController from "../controllers/BotController"

const botRouter = Router();

botRouter.get('/', BotController.getAll );

botRouter.post('/', BotController.create );

botRouter.get('/:id', BotController.get );

botRouter.put('/:id', BotController.edit );

botRouter.delete('/:id', BotController.del );

botRouter.get('/chat/:chatId', BotController.getAllForChat )

export default botRouter;