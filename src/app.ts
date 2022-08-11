import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import {
    ClientToServerEvents,
    SocketData,
    InterServerEvent,
    ServerToClientEvents,
} from "./interface";
import { createServer as createServerHttp } from "http";
import { createServer as createServerHttps } from "https";
import {
    addPseudo,
    cancelRequest,
    declineRequest,
    disconnect,
    getUser,
    requestUser,
} from "./socketFunc";
import { users } from "./utils";

dotenv.config();

const createServer =
    process.env.PROTOCOL === "HTTP" ? createServerHttp : createServerHttps;
const httpServer = createServer();
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvent,
    SocketData
>(httpServer, {
    cors: {
        origin: process.env.URL_FRONT,
    },
});

io.on("connection", (socket) => {
    socket.on("addPseudo", addPseudo(socket));
    socket.on("disconnect", disconnect(socket));
    socket.on("getUsers", getUser(socket));
    socket.on("requestUser", requestUser(socket));
    socket.on("cancelRequest", cancelRequest(socket));
    socket.on("declineRequest", declineRequest(socket));
});

httpServer.listen(process.env.PORT ? Number(process.env.PORT) : 8080, () => {
    console.log("Listen to " + process.env.URL_BACK + ":" + process.env.PORT);
});
