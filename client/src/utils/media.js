export const getLocalAudioStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    });

    return stream;
  } catch (error) {
    throw error;
  }
};

export const stopStream = (stream) => {
  if (!stream) return;

  stream.getTracks().forEach((track) => {
    track.stop();
  });
};

export const muteMicrophone = (stream) => {
  if (!stream) return;

  stream.getAudioTracks().forEach((track) => {
    track.enabled = false;
  });
};

export const unmuteMicrophone = (stream) => {
  if (!stream) return;

  stream.getAudioTracks().forEach((track) => {
    track.enabled = true;
  });
};

export const toggleMicrophone = (stream) => {
  if (!stream) return false;

  const audioTrack = stream.getAudioTracks()[0];

  if (!audioTrack) return false;

  audioTrack.enabled = !audioTrack.enabled;

  return audioTrack.enabled;
};

export const hasMicrophonePermission = async () => {
  try {
    const permission = await navigator.permissions.query({
      name: "microphone",
    });

    return permission.state;
  } catch (error) {
    return "prompt";
  }
};
