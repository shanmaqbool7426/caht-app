import { Router } from "express";
import {
  getAllMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);
router
  .route("/:chatId")
  .get(getAllMessages)
  .post(sendMessage);

export default router;
