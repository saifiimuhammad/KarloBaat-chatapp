// socket.tsx
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
  type FC,
} from "react";
import { io, Socket } from "socket.io-client";
import { server } from "./constants/config";

const SocketContext = createContext<Socket | null>(null);

const getSocket = (): Socket => {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error("Socket not initialized");
  return socket;
};

interface SocketProviderProps {
  children: ReactNode;
}

const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const socket = useMemo(() => io(server, { withCredentials: true }), []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, getSocket };
