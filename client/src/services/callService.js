import API from "./api";

export const startCall = async (receiverId) => {
  try {
    const { data } = await API.post("/call/start", {
      receiverId,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const acceptCall = async (callId) => {
  try {
    const { data } = await API.put(
      `/call/${callId}/accept`
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const rejectCall = async (callId) => {
  try {
    const { data } = await API.put(
      `/call/${callId}/reject`
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const endCall = async (callId) => {
  try {
    const { data } = await API.put(
      `/call/${callId}/end`
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const getCallHistory = async () => {
  try {
    const { data } = await API.get("/call");

    return data;
  } catch (error) {
    throw error;
  }
};