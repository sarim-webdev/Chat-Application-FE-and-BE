export const blobToFile = (blob, fileName = "voice.webm") => {
  return new File([blob], fileName, {
    type: blob.type || "audio/webm",
    lastModified: Date.now(),
  });
};

export const createAudioURL = (blob) => {
  if (!blob) return "";

  return URL.createObjectURL(blob);
};

export const revokeAudioURL = (url) => {
  if (!url) return;

  URL.revokeObjectURL(url);
};

export const downloadAudio = (
  url,
  fileName = `voice-${Date.now()}.webm`
) => {
  const link = document.createElement("a");

  link.href = url;

  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

export const getAudioDuration = (file) => {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio");

    audio.preload = "metadata";

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);

      resolve(Math.floor(audio.duration));
    };

    audio.onerror = () => {
      reject("Unable to read audio duration.");
    };

    audio.src = URL.createObjectURL(file);
  });
};

export const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};