import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import useAuth from "../hooks/useAuth";
import { useChat } from "./ChatContext";

import { createPeerConnection } from "../utils/peerConnection";
import {
    getLocalAudioStream,
} from "../utils/media";

import {
    playRingtone,
    stopRingtone,
    playCallingTone,
    stopCallingTone,
    playEndCallSound,
} from "../utils/ringtone";

const CallContext = createContext();

export const useCall = () => useContext(CallContext);

function CallProvider({ children }) {
    const { user } = useAuth();
    const { socket } = useChat();

    const [incomingCall, setIncomingCall] = useState(null);
    const [isCalling, setIsCalling] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callUser, setCallUser] = useState(null);

    const peerRef = useRef(null);

    const localAudioRef = useRef(null);
    const remoteAudioRef = useRef(null);

    const currentReceiver = useRef(null);

    const initializePeer = () => {
        if (peerRef.current) {
            return peerRef.current;
        }

        const peer = createPeerConnection();

        peerRef.current = peer;


        peer.ontrack = (event) => {
            const stream = event.streams[0];

            setRemoteStream(stream);
        };

        peer.onicecandidate = (event) => {
            if (!event.candidate) return;

            if (!currentReceiver.current) return;

            socket.emit("ice-candidate", {
                to: currentReceiver.current,
                candidate: event.candidate,
            });
        };

        return peer;
    };

    const initializeLocalAudio = async () => {
        if (localStream) return localStream;

        const stream = await getLocalAudioStream();

        setLocalStream(stream);

        const peer = initializePeer();

        stream.getTracks().forEach((track) => {
            peer.addTrack(track, stream);
        });

        return stream;
    };

    useEffect(() => {
        if (!localAudioRef.current) return;
        if (!localStream) return;

        localAudioRef.current.srcObject = localStream;
        localAudioRef.current.muted = true;
    }, [localStream]);

    useEffect(() => {
        if (!remoteAudioRef.current) return;
        if (!remoteStream) return;

        remoteAudioRef.current.srcObject = remoteStream;
    }, [remoteStream]);

    const startCall = async (receiver) => {
        try {
            currentReceiver.current = receiver._id;
            setCallUser(receiver);

            setCallEnded(false);
            setCallAccepted(false);
            setIncomingCall(null);

            setIsCalling(true);

            playCallingTone();

            if (peerRef.current) {
                peerRef.current.close();
                peerRef.current = null;
            }

            await initializeLocalAudio();

            const peer = initializePeer();

            const offer = await peer.createOffer();

            await peer.setLocalDescription(offer);

            socket.emit("call-user", {
                to: receiver._id,
                caller: {
                    _id: user._id,
                    userName: user.userName,
                    profileImage: user.profileImage,
                },
                offer,
            });

        } catch (error) {
            console.log(error);

            stopCallingTone();

            setIsCalling(false);
        }
    };

    const acceptCall = async () => {
        try {
            if (!incomingCall) return;

            stopRingtone();

            currentReceiver.current = incomingCall.caller._id;
            setCallUser(incomingCall.caller);

            setCallEnded(false);

            if (peerRef.current) {
                peerRef.current.close();
                peerRef.current = null;
            }

            await initializeLocalAudio();

            const peer = initializePeer();

            await peer.setRemoteDescription(
                new RTCSessionDescription(
                    incomingCall.offer
                )
            );

            const answer =
                await peer.createAnswer();

            await peer.setLocalDescription(answer);

            socket.emit("answer-call", {
                to: incomingCall.caller._id,
                answer,
            });

            setCallAccepted(true);

            setIncomingCall(null);

        } catch (error) {
            console.log(error);
        }
    };

    const rejectCall = () => {

        if (!incomingCall) return;

        stopRingtone();

        socket.emit("reject-call", {
            to: incomingCall.caller._id,
        });


        setIncomingCall(null);
        setCallAccepted(false);
        setIsCalling(false);

        playEndCallSound();

    };

    const endCall = (emit = true) => {
        try {
            if (emit && currentReceiver.current) {
                socket.emit("end-call", {
                    to: currentReceiver.current,
                });
            }

            stopCallingTone();

            stopRingtone();

            playEndCallSound();

            if (localStream) {
                localStream
                    .getTracks()
                    .forEach((track) => track.stop());
            }

            if (peerRef.current) {
                peerRef.current.close();

                peerRef.current = null;
            }

            setLocalStream(null);

            if (localAudioRef.current) {
                localAudioRef.current.srcObject = null;
            }

            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = null;
            }

            setRemoteStream(null);

            setIncomingCall(null);

            setIsCalling(false);

            setCallAccepted(false);

            setCallEnded(true);

            currentReceiver.current = null;
            setCallUser(null);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket.on("incoming-call", ({ caller, offer }) => {

            console.log("Incoming Event Fired");
            console.log(caller);
            playRingtone();

            currentReceiver.current = caller._id;

            setCallEnded(false);
            setCallAccepted(false);
            setIsCalling(false);

            setIncomingCall({
                caller,
                offer,
            });
        });

        socket.on("call-answered", async ({ answer }) => {
            try {
                if (!peerRef.current) return;

                await peerRef.current.setRemoteDescription(
                    new RTCSessionDescription(answer)
                );

                stopCallingTone();

                setIsCalling(false);

                setCallAccepted(true);
            } catch (error) {
                console.log(error);
            }
        });

        socket.on("ice-candidate", async ({ candidate }) => {
            try {
                if (
                    peerRef.current &&
                    candidate
                ) {
                    await peerRef.current.addIceCandidate(
                        new RTCIceCandidate(candidate)
                    );
                }
            } catch (error) {
                console.log(error);
            }
        });

        socket.on("call-rejected", () => {

            stopCallingTone();

            playEndCallSound();

            endCall(false);

        });

        socket.on("call-ended", () => {
            stopCallingTone();

            stopRingtone();

            playEndCallSound();

            endCall(false);
        });


        return () => {
            socket.off("incoming-call");
            socket.off("call-answered");
            socket.off("ice-candidate");
            socket.off("call-rejected");
            socket.off("call-ended");
        };
    }, [socket]);

    useEffect(() => {
        return () => {
            endCall(false);
        };
    }, []);

    return (
        <CallContext.Provider
            value={{
                localStream,
                remoteStream,

                localAudioRef,
                remoteAudioRef,

                incomingCall,

                isCalling,

                callAccepted,

                callEnded,

                startCall,

                acceptCall,

                rejectCall,

                endCall,

                callUser,
            }}
        >
            {children}


            <audio
                ref={localAudioRef}
                autoPlay
                playsInline
                muted
            />

            <audio
                ref={remoteAudioRef}
                autoPlay
                playsInline
            />
        </CallContext.Provider>
    );
}

export default CallProvider;