import { Router } from "express";
import {
  createOrGetAOneOnOneChat,
  addNewParticipantInGroupChat,
  createAGroupChat,
  deleteGroupChat,
  deleteOneOnOneChat,
  getAllChats,
  getGroupChatDetails,
  leaveGroupChat,
  removeParticipantFromGroupChat,
  searchAvailableUsers,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import {
//   createAGroupChatValidator,
//   updateGroupChatNameValidator,
// } from "../../../validators/apps/chat-app/chat.validators.js";
// import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
// import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getAllChats);
      

router.route("/users").get(searchAvailableUsers);

router
  .route("/c/:receiverId")
  .post(
   
    createOrGetAOneOnOneChat
  );

router
  .route("/group")
  .post(createAGroupChat);

router
  .route("/group/:chatId")
  .get( getGroupChatDetails)
  .delete( deleteGroupChat);

router
  .route("/group/:chatId/:participantId")
  .post(
    addNewParticipantInGroupChat
  )
  .delete(
    removeParticipantFromGroupChat
  );

router
  .route("/leave/group/:chatId")
  .delete( leaveGroupChat);

router
  .route("/remove/:chatId")
  .delete(deleteOneOnOneChat);

export default router;
