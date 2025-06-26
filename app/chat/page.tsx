"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { Send, Loader2 } from "lucide-react";

type UserRole = "hr" | "applicant";

interface Message {
  userId: string;
  userType: UserRole;
  message: string;
  timestamp: number;
}

interface SessionUser {
  id: string;
  role: UserRole;
  name?: string;
  email?: string;
}

export default function ChatPage() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const user = session?.user as SessionUser | undefined;
  const userType: UserRole = user?.role === "hr" ? "hr" : "applicant";
  const userId = user?.id || "anonymous";
  const roomId = "hr-applicant-chat"; // You can make this dynamic based on the conversation

  useEffect(() => {
    const socketInstance = io({
      path: "/api/socket",
      addTrailingSlash: false,
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ["websocket", "polling"],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false,
    });

    socketInstance.on("connect_error", (err) => {
      console.log("Connection error:", err);
      setError("Failed to connect to chat server");
    });

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO");
      setIsConnected(true);
      setError(null);
      
      // Join the chat room
      socketInstance.emit("join_room", {
        roomId,
        userId,
        userType,
      });
    });

    socketInstance.on("chat_history", (history: Message[]) => {
      setMessages(history);
      scrollToBottom();
    });

    socketInstance.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    socketInstance.on("user_typing", ({ userId: typingUserId, isTyping }) => {
      if (typingUserId !== userId) {
        setRemoteTyping(isTyping);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId, userType]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTyping = () => {
    if (!socket) return;

    socket.emit("typing", {
      roomId,
      userId,
      isTyping: true,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        roomId,
        userId,
        isTyping: false,
      });
    }, 1000);
  };

  const sendMessage = () => {
    if (!socket || !message.trim()) return;

    const messageData = {
      roomId,
      userId,
      userType,
      message: message.trim(),
      timestamp: Date.now(),
    };

    socket.emit("send_message", messageData);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4">
          <h1 className="text-xl font-semibold">
            Chat with {userType === "hr" ? "Applicant" : "HR"}
          </h1>
          <div className="text-sm">
            {isConnected ? (
              <span className="text-green-200">●</span>
            ) : (
              <span className="text-red-200">●</span>
            )}{" "}
            {isConnected ? "Connected" : "Disconnected"}
            {error && (
              <span className="text-red-200 ml-2">{error}</span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="h-[calc(100vh-300px)] overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.userId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.userId === userId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {msg.userId === userId ? "You" : msg.userType}
                </div>
                <div className="break-words">{msg.message}</div>
                <div className="text-xs mt-1 opacity-75">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {remoteTyping && (
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Someone is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
