import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "node:http";
import { redis } from "./redis";

const ONLINE_USERS_KEY = "stupid:online_users";

let io: SocketIOServer | null = null;

export const initSocketIO = (httpServer: HttpServer, corsOrigins: string[]) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
    path: "/socket.io",
  });

  io.on("connection", async (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Track this socket ID in Redis set
    await redis.sadd(ONLINE_USERS_KEY, socket.id);
    const count = await redis.scard(ONLINE_USERS_KEY);

    // Broadcast updated count to all clients
    io!.emit("online:count", count);

    // --- Stupid Chat ---
    socket.on(
      "chat:message",
      async (payload: { userId: string; name: string; avatar: string; text: string }) => {
        const rateLimitKey = `stupid:chat:ratelimit:${payload.userId}`;
        const isLimited = await redis.exists(rateLimitKey);

        if (isLimited) {
          const ttl = await redis.ttl(rateLimitKey);
          socket.emit("chat:error", {
            message: `Slow down! You can send another message in ${ttl}s.`,
          });
          return;
        }

        // Set 60 second slow-mode key
        await redis.set(rateLimitKey, "1", "EX", 60);

        const message = {
          id: `${socket.id}-${Date.now()}`,
          userId: payload.userId,
          name: payload.name,
          avatar: payload.avatar,
          text: payload.text,
          timestamp: new Date().toISOString(),
        };

        // Broadcast to everyone (including sender)
        io!.emit("chat:message", message);
      },
    );

    socket.on("disconnect", async () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
      await redis.srem(ONLINE_USERS_KEY, socket.id);
      const newCount = await redis.scard(ONLINE_USERS_KEY);
      io!.emit("online:count", newCount);
    });
  });

  console.log("[Socket] Socket.io initialised");
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("[Socket] Socket.io not initialised");
  return io;
};
