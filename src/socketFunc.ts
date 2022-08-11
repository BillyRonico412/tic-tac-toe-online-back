import { IoType, SocketType } from "./interface";
import { users } from "./utils";

export const addPseudo = (socket: SocketType) => async (pseudo: string) => {
    if (
        3 <= pseudo.length &&
        pseudo.length <= 10 &&
        users.every((user) => user.pseudo !== pseudo)
    ) {
        socket.data.pseudo = pseudo;
        await socket.join("users");
        users.push({ pseudo, socketId: socket.id });
        socket.emit("acceptPseudo", pseudo);
        console.log("acceptPseudo");
        socket.to("users").emit(
            "updateUser",
            users.map((user) => user.pseudo)
        );
    } else {
        socket.emit("declinePseudo", pseudo);
    }
};

export const disconnect = (socket: SocketType) => async () => {
    const indexUser = users.findIndex((user) => user.socketId === socket.id);
    if (indexUser >= 0) {
        users.splice(indexUser, 1);
        socket.to("users").emit(
            "updateUser",
            users.map((user) => user.pseudo)
        );
    }
};

export const getUser = (socket: SocketType) => async () => {
    socket.emit(
        "updateUser",
        users.map((user) => user.pseudo)
    );
};

export const requestUser = (socket: SocketType) => async (pseudo: string) => {
    const userWithPseudo = users.find((user) => user.pseudo === pseudo);
    if (userWithPseudo && socket.data.pseudo) {
        socket
            .to(userWithPseudo.socketId)
            .emit("requestUser", socket.data.pseudo);
    }
};

export const cancelRequest = (socket: SocketType) => async (pseudo: string) => {

    const userWithPseudo = users.find((user) => user.pseudo === pseudo);
    if (userWithPseudo) {
        socket.to(userWithPseudo.socketId).emit("cancelRequest");
    }
};

export const declineRequest = (socket: SocketType) => async (pseudo: string) => {
    const userWithPseudo = users.find((user) => user.pseudo === pseudo);
    if (userWithPseudo) {
        socket.to(userWithPseudo.socketId).emit("declineRequest");
    }
};