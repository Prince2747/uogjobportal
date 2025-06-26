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
  Settings,
} from "lucide-react";
import Link from "next/link";
import Peer from "peerjs";

interface CallConnection {
  call: any;
  conn: any;
}

export default function VideoCall() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remotePeerId, setRemotePeerId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");
  
  const peerInstance = useRef<Peer | null>(null);
  const connectionRef = useRef<CallConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize media stream
  const initializeMedia = async (video: boolean = true, audio: boolean = true) => {
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: video, 
        audio: audio 
      });
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setError("Could not access camera/microphone. Please check permissions.");
      throw err;
    }
  };

  useEffect(() => {
    // Authentication temporarily disabled for development
    /*
    if (status === "unauthenticated") {
      router.push("/signin");
    }
    */

    // Initialize media on component mount
    initializeMedia(isCameraOn, isMicOn).catch(console.error);

    // Initialize PeerJS
    const peer = new Peer({
      host: "0.peerjs.com",
      port: 443,
      path: "/",
      secure: true,
      debug: 1
    });

    peer.on("open", (id) => {
      setPeerId(id);
      setConnectionStatus("Ready");
      console.log("My peer ID is: " + id);
      setError(null);
    });

    peer.on("connection", (conn) => {
      console.log("Data connection established");
      if (connectionRef.current) {
        connectionRef.current.conn = conn;
      } else {
        connectionRef.current = { call: null, conn };
      }
      
      setIsConnected(true);
      setConnectionStatus("Connected");
      
      conn.on("data", (data) => {
        setMessages((prev) => [...prev, `Remote: ${data}`]);
      });
      
      conn.on("close", () => {
        console.log("Data connection closed");
        if (!connectionRef.current?.call) {
          setIsConnected(false);
          setConnectionStatus("Disconnected");
        }
      });

      conn.on("error", (err) => {
        console.error("Connection error:", err);
        setError("Connection error: " + err.message);
      });
    });

    peer.on("call", async (call) => {
      console.log("Incoming call received");
      try {
        const stream = await initializeMedia(isCameraOn, isMicOn);
        call.answer(stream);
        
        if (connectionRef.current) {
          connectionRef.current.call = call;
        } else {
          connectionRef.current = { call, conn: null };
        }
        
        setIsInCall(true);
        setConnectionStatus("In Call");
        
        call.on("stream", (remoteStream) => {
          console.log("Remote stream received");
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        call.on("close", () => {
          console.log("Call ended");
          setIsInCall(false);
          if (!connectionRef.current?.conn) {
            setIsConnected(false);
            setConnectionStatus("Disconnected");
          } else {
            setConnectionStatus("Connected");
          }
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }
        });

        call.on("error", (err) => {
          console.error("Call error:", err);
          setError("Call error: " + err.message);
          setIsInCall(false);
        });
      } catch (err) {
        console.error("Error answering call:", err);
        setError("Failed to answer call");
      }
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
      setError("Peer error: " + err.message);
      setConnectionStatus("Error");
    });

    peer.on("disconnected", () => {
      console.log("Peer disconnected");
      setConnectionStatus("Disconnected");
    });

    peerInstance.current = peer;

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (connectionRef.current?.call) {
        connectionRef.current.call.close();
      }
      if (connectionRef.current?.conn) {
        connectionRef.current.conn.close();
      }
      if (peer && !peer.destroyed) {
        peer.destroy();
      }
    };
  }, [status, router]);

  const connectToPeer = async () => {
    if (!remotePeerId.trim()) {
      setError("Please enter a remote peer ID");
      return;
    }

    if (!peerInstance.current) {
      setError("Peer not initialized");
      return;
    }

    try {
      setError(null);
      setConnectionStatus("Connecting...");

      // Establish data connection
      const conn = peerInstance.current.connect(remotePeerId);
      
      conn.on("open", () => {
        console.log("Data connection opened");
        setIsConnected(true);
        setConnectionStatus("Connected");
      });

      conn.on("data", (data) => {
        setMessages((prev) => [...prev, `Remote: ${data}`]);
      });

      conn.on("close", () => {
        console.log("Data connection closed");
        if (!connectionRef.current?.call) {
          setIsConnected(false);
          setConnectionStatus("Disconnected");
        }
      });

      conn.on("error", (err) => {
        console.error("Connection error:", err);
        setError("Failed to connect: " + err.message);
        setConnectionStatus("Error");
      });

      // Initialize media and make call
      const stream = await initializeMedia(isCameraOn, isMicOn);
      const call = peerInstance.current.call(remotePeerId, stream);

      connectionRef.current = { call, conn };
      setIsInCall(true);
      setConnectionStatus("In Call");

      call.on("stream", (remoteStream) => {
        console.log("Remote stream received");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      call.on("close", () => {
        console.log("Call ended");
        setIsInCall(false);
        if (connectionRef.current?.conn) {
          setConnectionStatus("Connected");
        } else {
          setIsConnected(false);
          setConnectionStatus("Disconnected");
        }
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      });

      call.on("error", (err) => {
        console.error("Call error:", err);
        setError("Call failed: " + err.message);
        setIsInCall(false);
        setConnectionStatus("Error");
      });

    } catch (err) {
      console.error("Error connecting to peer:", err);
      setError("Failed to connect to peer");
      setConnectionStatus("Error");
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleCamera = async () => {
    try {
      if (localStreamRef.current) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = !videoTrack.enabled;
          setIsCameraOn(videoTrack.enabled);
          
          // If we're turning the camera back on and the track is ended, restart the stream
          if (videoTrack.enabled && videoTrack.readyState === 'ended') {
            await restartVideoStream();
          }
        }
      } else if (!isCameraOn) {
        // If no stream exists and we're turning camera on, create new stream
        await restartVideoStream();
      }
    } catch (err) {
      console.error("Error toggling camera:", err);
      setError("Failed to toggle camera");
    }
  };

  const restartVideoStream = async () => {
    try {
      // Stop existing stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }

      // Create new stream
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: isMicOn 
      });
      
      localStreamRef.current = newStream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = newStream;
      }

      // Update the call with new stream if in call
      if (connectionRef.current?.call && isInCall) {
        // Note: PeerJS doesn't support stream replacement easily
        // For production, you might want to implement a more sophisticated solution
        console.log("Stream restarted - call may need to be reestablished");
      }

      setIsCameraOn(true);
    } catch (err) {
      console.error("Error restarting video stream:", err);
      setError("Failed to restart camera");
    }
  };

  const disconnectCall = () => {
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (connectionRef.current?.call) {
        connectionRef.current.call.close();
      }
      
      if (connectionRef.current?.conn) {
        connectionRef.current.conn.close();
      }
      
      connectionRef.current = null;
      setIsConnected(false);
      setIsInCall(false);
      setRemotePeerId("");
      setConnectionStatus("Disconnected");
      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      
      // Restart local stream for next call
      initializeMedia(isCameraOn, isMicOn).catch(console.error);
    } catch (err) {
      console.error("Error disconnecting:", err);
      setError("Error disconnecting call");
    }
  };

  const sendMessage = () => {
    if (connectionRef.current?.conn && message.trim()) {
      try {
        connectionRef.current.conn.send(message.trim());
        setMessages((prev) => [...prev, `Me: ${message.trim()}`]);
        setMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
        setError("Failed to send message");
      }
    }
  };

  const copyPeerId = () => {
    if (peerId) {
      navigator.clipboard.writeText(peerId).then(() => {
        // Could add a toast notification here
        console.log("Peer ID copied to clipboard");
      }).catch(err => {
        console.error("Failed to copy peer ID:", err);
      });
    }
  };

  const clearError = () => {
    setError(null);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading video call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/hr" className="text-blue-600 hover:text-blue-800 flex items-center">
                <span className="mr-2">←</span>
                Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Video Interview</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                connectionStatus === "Ready" ? "bg-green-100 text-green-800" :
                connectionStatus === "Connected" ? "bg-blue-100 text-blue-800" :
                connectionStatus === "In Call" ? "bg-purple-100 text-purple-800" :
                connectionStatus === "Connecting..." ? "bg-yellow-100 text-yellow-800" :
                connectionStatus === "Error" ? "bg-red-100 text-red-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {connectionStatus}
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  disabled={!peerId}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                  title="Copy ID"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              {error && (
                <div className="flex items-center bg-red-50 text-red-600 px-3 py-2 rounded-lg">
                  <span className="text-sm">{error}</span>
                  <button
                    onClick={clearError}
                    className="ml-2 hover:bg-red-100 rounded-full p-1"
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
                disabled={isConnected}
              />
              <button
                onClick={isConnected ? disconnectCall : connectToPeer}
                disabled={!peerId || (!remotePeerId.trim() && !isConnected)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
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
                  You {!isCameraOn && "(Camera Off)"}
                </div>
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <VideoOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
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
                  {isInCall ? "Remote" : "Waiting for connection..."}
                </div>
                {!isInCall && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Chat Section */}
            <div className="col-span-2 flex flex-col">
              <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 h-[calc(100vh-400px)] min-h-[300px] overflow-y-auto">
                <div className="space-y-2">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No messages yet
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-lg text-sm ${
                          msg.startsWith("Me:") ? "bg-blue-100 ml-2" : "bg-gray-100 mr-2"
                        }`}
                      >
                        {msg}
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  disabled={!isConnected}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!isConnected || !message.trim()}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mt-6">
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

            {isInCall && (
              <button
                onClick={disconnectCall}
                className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Share your Peer ID with the person you want to call</li>
              <li>2. Enter their Peer ID in the input field above</li>
              <li>3. Click "Connect" to establish the video call</li>
              <li>4. Use the controls to toggle your microphone and camera</li>
              <li>5. Use the chat to send text messages during the call</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}