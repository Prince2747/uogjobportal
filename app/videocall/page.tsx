"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Copy,
  Users,
  MessageCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import Peer from "peerjs";

export default function VideoCall() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remotePeerId, setRemotePeerId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const peerInstance = useRef<Peer | null>(null);
  const connRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Authentication temporarily disabled for development
    /*
    if (status === "unauthenticated") {
      router.push("/signin");
    }
    */

    // Initialize PeerJS
    const peer = new Peer({
      host: "0.peerjs.com",
      port: 443,
      path: "/",
      secure: true,
      debug: 3
    });

    peer.on("open", (id) => {
      setPeerId(id);
      console.log("My peer ID is: " + id);
    });

    peer.on("connection", (conn) => {
      connRef.current = conn;
      setIsConnected(true);
      conn.on("data", (data) => {
        setMessages((prev) => [...prev, `Remote: ${data}`]);
      });
      conn.on("close", () => {
        setIsConnected(false);
        setError("Connection closed");
      });
    });

    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: isCameraOn, audio: isMicOn })
        .then((stream) => {
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        })
        .catch((err) => {
          console.error("Error accessing media devices:", err);
          setError("Could not access camera/microphone");
        });
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
      setError(err.message);
    });

    peerInstance.current = peer;

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peer) peer.destroy();
    };
  }, [status, router, isCameraOn, isMicOn]);

  const connectToPeer = () => {
    if (!remotePeerId) {
      setError("Please enter a remote peer ID");
      return;
    }

    if (peerInstance.current && remotePeerId) {
      const conn = peerInstance.current.connect(remotePeerId);
      connRef.current = conn;
      setIsConnected(true);

      conn.on("data", (data) => {
        setMessages((prev) => [...prev, `Remote: ${data}`]);
      });

      conn.on("close", () => {
        setIsConnected(false);
        setError("Connection closed");
      });

      navigator.mediaDevices
        .getUserMedia({ video: isCameraOn, audio: isMicOn })
        .then((stream) => {
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          const call = peerInstance.current?.call(remotePeerId, stream);

          call?.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });

          call?.on("error", (err) => {
            console.error("Call error:", err);
            setError("Call failed: " + err.message);
          });
        })
        .catch((err) => {
          console.error("Error accessing media devices:", err);
          setError("Could not access camera/microphone");
        });
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn;
        setIsCameraOn(!isCameraOn);
      }
    }
  };

  const disconnectCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (connRef.current) {
      connRef.current.close();
    }
    setIsConnected(false);
    setRemotePeerId("");
  };

  const sendMessage = () => {
    if (connRef.current && message) {
      connRef.current.send(message);
      setMessages((prev) => [...prev, `Me: ${message}`]);
      setMessage("");
    }
  };

  const copyPeerId = () => {
    if (peerId) {
      navigator.clipboard.writeText(peerId);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto p-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          {/* Connection Info */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Your ID:</span>
                <code className="bg-gray-100 px-3 py-1 rounded-md text-sm font-mono">
                  {peerId || "Connecting..."}
                </code>
                <button
                  onClick={copyPeerId}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Copy ID"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              {error && (
                <div className="text-red-500 text-sm flex items-center">
                  <span>{error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="ml-2 hover:bg-gray-100 rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={remotePeerId}
                onChange={(e) => setRemotePeerId(e.target.value)}
                placeholder="Enter Remote Peer ID"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={isConnected ? disconnectCall : connectToPeer}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  isConnected
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {isConnected ? (
                  <>
                    <PhoneOff className="w-4 h-4" />
                    <span>Disconnect</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4" />
                    <span>Connect</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Local Video */}
            <div className="col-span-5">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
                  You
                </div>
              </div>
            </div>

            {/* Remote Video */}
            <div className="col-span-5">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
                  Remote
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className="col-span-2 flex flex-col">
              <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 h-[calc(100vh-400px)] min-h-[300px] overflow-y-auto">
                <div className="space-y-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg ${
                        msg.startsWith("Me:") ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      {msg}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="relative">
              <button
                onClick={toggleMic}
                className={`p-4 rounded-full transition-colors duration-200 ${
                  isMicOn 
                    ? "bg-blue-500 text-white hover:bg-blue-600" 
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
                title={isMicOn ? "Microphone is ON" : "Microphone is OFF"}
              >
                {isMicOn ? (
                  <Mic className="w-6 h-6" />
                ) : (
                  <MicOff className="w-6 h-6" />
                )}
              </button>
              <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white ${
                isMicOn ? "bg-green-500" : "bg-red-500"
              }`}></div>
            </div>

            <div className="relative">
              <button
                onClick={toggleCamera}
                className={`p-4 rounded-full transition-colors duration-200 ${
                  isCameraOn 
                    ? "bg-blue-500 text-white hover:bg-blue-600" 
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
                title={isCameraOn ? "Camera is ON" : "Camera is OFF"}
              >
                {isCameraOn ? (
                  <Video className="w-6 h-6" />
                ) : (
                  <VideoOff className="w-6 h-6" />
                )}
              </button>
              <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white ${
                isCameraOn ? "bg-green-500" : "bg-red-500"
              }`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
