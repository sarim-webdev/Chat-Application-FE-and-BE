import API from "./api";

export const getNotifications = async () => {
  try {
    const { data } = await API.get("/notification");

    return data;
  } catch (error) {
    throw error;
  }
};

export const markNotificationRead = async (notificationId) => {
  try {
    const { data } = await API.put(
      `/notification/${notificationId}/read`
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const markAllNotificationsRead = async () => {
  try {
    const { data } = await API.put(
      "/notification/read-all"
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const { data } = await API.delete(
      `/notification/${notificationId}`
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteConversationNotifications = async ({
  chatId,
  groupId,
}) => {
  const res = await API.delete("/notification/conversation", {
    data: {
      chatId,
      groupId,
    },
  });

  return res.data;
};