import { Server, Socket } from "socket.io";

export interface ServerToClientEvents {
    acceptPseudo: (pseudo: string) => void;
    declinePseudo: (pseudo: string) => void;
    updateUser: (pseudos: string[]) => void;
    requestUser: (pseudo: string) => void;
    cancelRequest: () => void;
    declineRequest: () => void;
}

export interface ClientToServerEvents {
    addPseudo: (pseudo: string) => void;
    getUsers: () => void;
    requestUser: (pseudo: string) => void;
    cancelRequest: (pseudo: string) => void;
    declineRequest: (pseudo: string) => void;
}

export interface InterServerEvent {}

export interface SocketData {
    pseudo?: string;
}

export type SocketType = Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvent,
    SocketData
>;

export type IoType = Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvent,
    SocketData
>;

export interface User {
    socketId: string;
    pseudo: string;
}
