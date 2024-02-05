import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { ChatEventEnum } from "../constants/index.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";


const mountJoinChatEvent = (socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    socket.join(chatId);
  });
};


const mountParticipantTypingEvent = (socket) => {
  socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
    console.log('>> typingggggggggggggg')
    socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
  });
};

const mountParticipantStoppedTypingEvent = (socket) => {
  socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
  });
};


const initializeSocketIO = (io) => {
  return io.on("connection", async (socket) => {
    try {
      // parse the cookies from the handshake headers (This is only possible if client has `withCredentials: true`)
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      let token = cookies['connect.sid']; // get the accessToken

      if (!token) {
        // If there is no access token in cookies. Check inside the handshake auth
        token = socket.handshake.auth?.token;
      }

      if (!token) {
        // Token is required for the socket to work
        throw new ApiError(401, "Un-authorized handshake. Token is missing");
      }
      const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // decode the token

      const user = await User.findById(decodedToken?._id).select(
        "-password"
      );

      // retrieve the user
      if (!user) {
        throw new ApiError(401, "Un-authorized handshake. Token is invalid");
      }
      socket.user = user; // mount te user object to the socket

      socket.join(user._id.toString());
      socket.emit(ChatEventEnum.CONNECTED_EVENT); // emit the connected event so that client is aware

      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        if (socket.user?._id) {
          socket.leave(socket.user._id);
        }
      });
    } catch (error) {
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        error?.message || "Something went wrong while connecting to the socket."
      );
    }
  });
};


const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
