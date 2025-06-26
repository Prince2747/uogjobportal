import { Server as NetServer } from "net";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";
import { Redis } from "ioredis";

export const redis = new Redis({
  host: "relieved-basilisk-19666.upstash.io",
  port: 6379,
  username: "default",
  password: process.env.UPSTASH_REDIS_REST_TOKEN,
  tls: {
    rejectUnauthorized: false
  }
});

export type NextApiResponseServerIO = NextApiResponse & {
  socket: NetServer & {
    server?: NetServer & {
      io?: SocketIOServer;
    };
  };
};

let io: SocketIOServer | undefined;
