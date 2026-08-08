import { iceServers } from "./iceServers";

export const createPeerConnection = (
  localStream,
  onIceCandidate,
  onRemoteStream,
) => {
  const peer = new RTCPeerConnection(iceServers);

  if (localStream) {
    localStream.getTracks().forEach((track) => {
      peer.addTrack(track, localStream);
    });
  }

  peer.ontrack = (event) => {
    if (event.streams && event.streams[0]) {
      onRemoteStream(event.streams[0]);
    }
  };

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };

  peer.onconnectionstatechange = () => {
    console.log("Connection State =>", peer.connectionState);
  };

  peer.oniceconnectionstatechange = () => {
    console.log("ICE State =>", peer.iceConnectionState);
  };

  return peer;
};

export const createOffer = async (peer) => {
  const offer = await peer.createOffer();

  await peer.setLocalDescription(offer);

  return offer;
};

export const createAnswer = async (peer, offer) => {
  await peer.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await peer.createAnswer();

  await peer.setLocalDescription(answer);

  return answer;
};

export const setRemoteAnswer = async (peer, answer) => {
  await peer.setRemoteDescription(new RTCSessionDescription(answer));
};

export const addIceCandidate = async (peer, candidate) => {
  if (!candidate) return;

  try {
    await peer.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (error) {
    console.log(error);
  }
};


export const closePeerConnection = (peer) => {
  if (!peer) return;

  peer.close();
};
