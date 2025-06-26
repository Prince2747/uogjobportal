import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { redis } from "@/app/lib/socket";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface CustomServer extends NetServer {
  io?: ServerIO;
}

interface MessageData {
  roomId: string;
  userId: string;
  userType: string;
  message: string;
  timestamp: number;
}

let io: ServerIO | null = null;

export async function GET(req: Request) {
  try {
    if (!req.headers.get("socket")) {
      return new Response("Socket header not found", { status: 400 });
    }

    if (!io) {
      console.log("Setting up Socket.io server...");
      
      io = new ServerIO({
        path: "/api/socket",
        addTrailingSlash: false,
        cors: {
          origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
          methods: ["GET", "POST"],
        },
      });

      io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        // Join a chat room
        socket.on("join_room", async (data: { roomId: string; userId: string; userType: string }) => {
          const { roomId, userId, userType } = data;
          socket.join(roomId);

          // Store user info in Redis
          await redis.hset(
            `chat_room:${roomId}`,
            userId,
            JSON.stringify({ userType, socketId: socket.id })
          );

          // Get chat history from Redis
          const messages = await redis.lrange(`messages:${roomId}`, 0, -1);
          const parsedMessages = messages.map((msg: string) => JSON.parse(msg));
          socket.emit("chat_history", parsedMessages);
        });

        // Handle new messages
        socket.on("send_message", async (data: MessageData) => {
          const { roomId, message, userId, userType, timestamp } = data;

          const messageData = {
            userId,
            userType,
            message,
            timestamp,
          };

          // Store message in Redis
          await redis.rpush(
            `messages:${roomId}`,
            JSON.stringify(messageData)
          );

          // Broadcast to all clients in the room
          io?.to(roomId).emit("receive_message", messageData);
        });

        // Handle typing status
        socket.on("typing", (data: { roomId: string; userId: string; isTyping: boolean }) => {
          const { roomId, userId, isTyping } = data;
          socket.to(roomId).emit("user_typing", { userId, isTyping });
        });

        // Handle disconnection
        socket.on("disconnect", async () => {
          console.log("Client disconnected:", socket.id);
          // Clean up Redis user info
          const rooms = await redis.keys("chat_room:*");
          for (const room of rooms) {
            const users = await redis.hgetall(room);
            for (const [userId, userData] of Object.entries(users)) {
              const parsedData = JSON.parse(userData as string);
              if (parsedData.socketId === socket.id) {
                await redis.hdel(room, userId);
              }
            }
          }
        });
      });
    }

    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    console.error("Socket error:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
