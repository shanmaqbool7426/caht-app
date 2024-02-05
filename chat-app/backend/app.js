import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // configure static file to save images locally
app.use(cookieParser());
const corsOrigin ={
    origin:'http://localhost:3000', //or whatever port your frontend is using
    credentials:true,            
    optionSuccessStatus:200
}
app.use(cors(corsOrigin));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`

// global middlewares


// Apply the rate limiting middleware to all requests




// * App routes
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import { initializeSocketIO } from "./socket/index.js";


// * Public apis
// TODO: More functionality specific to the type of api, can be added in the future

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat-app/chats", chatRouter);

// app.use("/api/v1/chat-app/chats", chatRouter);
app.use("/api/v1/chat-app/messages", messageRouter);

initializeSocketIO(io);

export { httpServer, io };
