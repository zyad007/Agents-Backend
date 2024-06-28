import { Router } from "express";
import * as ChatController from "../controllers/ChatController"

const chatRouter = Router();

chatRouter.get('/', ChatController.getAll);

// chatRouter.get('/:id', ChatController.get);

chatRouter.post('/', ChatController.create);

chatRouter.delete('/:id', ChatController.del);

chatRouter.post('/send/:id/:botId', ChatController.send);

chatRouter.post('/:id/add-bot', ChatController.addBot);

chatRouter.post('/:id/remove-bot', ChatController.removeBot);

chatRouter.get('/:id', ChatController.getBots);

export default chatRouter;