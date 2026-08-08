import API from "./api";

export const sendMessage = async (
  chat,
  text,
  image = null,
  replyTo = null,
  voice = null,
  file = null,
  voiceDuration = 0,
) => {
  try {
    const formData = new FormData();

    formData.append("chat", chat);
    formData.append("text", text);
    formData.append("voiceDuration", voiceDuration);

    if (replyTo) {
      formData.append("replyTo", JSON.stringify(replyTo));
    }

    if (image) {
      formData.append("image", image);
    }

    if (voice) {
      formData.append("voice", voice);
    }

    if (file) {
      formData.append("file", file);
    }

    const { data } = await API.post("/message/send", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const getMessages = async (chatId) => {
  try {
    const { data } = await API.get(`/message/${chatId}`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const markMessageSeen = async (messageId) => {
  try {
    const { data } = await API.put(`/message/seen/${messageId}`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const editMessage = (id, text) => {
  return API.put(`/message/edit/${id}`, {
    text,
  });
};

export const deleteForEveryone = (id) => {
  return API.put(`/message/delete/everyone/${id}`);
};

export const deleteForMe = (messageId) => {
  return API.put(`/message/delete-for-me/${messageId}`);
};

export const toggleReaction = async (messageId, emoji) => {
  try {
    const { data } = await API.put(`/message/reaction/${messageId}`, {
      emoji,
    });

    return data;
  } catch (error) {
    throw error;
  }
};
