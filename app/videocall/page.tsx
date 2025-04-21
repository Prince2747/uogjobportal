"use client";

import { useEffect, useState, useRef } from "react";

export default function Chat() {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remotePeerId, setRemotePeerId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const peerInstance = useRef<any>(null);
  const connRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let peer: any;

    import("peerjs").then(({ default: Peer }) => {
      peer = new Peer({
        host: "peerjs-s1gp.onrender.com",
        secure: true,
        path: "/app",
        port: 9000,
      });

      peer.on("open", (id: string) => {
        setPeerId(id);
        console.log("My peer ID is: " + id);
      });

      peer.on("connection", (conn: any) => {
        connRef.current = conn;
        conn.on("data", (data: string) => {
          setMessages((prev) => [...prev, `Remote: ${data}`]);
        });
      });

      peer.on("call", (call: any) => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            localStreamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
            call.answer(stream);
            call.on("stream", (remoteStream: MediaStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
              }
            });
          })
          .catch((err) => console.error("Error accessing media devices:", err));
      });

      peer.on("error", (err: any) => {
        console.error("PeerJS error:", err);
      });

      peerInstance.current = peer;
    });

    return () => {
      if (peer) peer.destroy();
    };
  }, []);

  const connectToPeer = () => {
    if (peerInstance.current && remotePeerId) {
      const conn = peerInstance.current.connect(remotePeerId);
      connRef.current = conn;

      conn.on("data", (data: string) => {
        setMessages((prev) => [...prev, `Remote: ${data}`]);
      });

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          const call = peerInstance.current.call(remotePeerId, stream);

          call.on("stream", (remoteStream: MediaStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });

          call.on("error", (err: any) => console.error("Call error:", err));
        })
        .catch((err) => console.error("Error accessing media devices:", err));
    }
  };

  const sendMessage = () => {
    if (connRef.current && message) {
      connRef.current.send(message);
      setMessages((prev) => [...prev, `Me: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-semibold mb-4 text-center">
          Video Call Platform
        </h1>
        {peerId ? (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-gray-600 font-medium">
                Your ID:{" "}
                <span className="text-black font-semibold">{peerId}</span>
              </p>
              <input
                type="text"
                value={remotePeerId}
                onChange={(e) => setRemotePeerId(e.target.value)}
                placeholder="Remote Peer ID"
                className="border border-gray-300 rounded px-4 py-2 w-64 text-sm"
              />
              <button
                onClick={connectToPeer}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
              >
                Connect
              </button>
            </div>

            <div className="flex gap-6">
              {/* Video Section */}
              <div className="flex-1 relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-[500px] bg-black rounded-xl shadow"
                />
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute bottom-4 right-4 w-40 h-28 bg-gray-800 border-2 border-white rounded shadow"
                />
              </div>

              {/* Chat Section */}
              <div className="w-80 flex flex-col border-l border-gray-200 pl-4">
                <h2 className="text-lg font-semibold mb-2">Chat</h2>
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded p-3 overflow-y-auto text-sm mb-2 h-[400px]">
                  {messages.map((msg, index) => (
                    <p key={index} className="mb-1">
                      {msg}
                    </p>
                  ))}
                </div>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="border border-gray-300 rounded px-3 py-2 text-sm mb-2"
                />
                <button
                  onClick={sendMessage}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading PeerJS...</p>
        )}
      </div>
    </div>
  );
}
