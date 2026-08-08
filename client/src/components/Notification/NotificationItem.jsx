import { useNavigate } from "react-router-dom";

import {
    deleteConversationNotifications,
} from "../../services/notificationService";

function NotificationItem({
    notification,
    refreshNotifications,
    closeDropdown,
}) {
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            await deleteConversationNotifications({
                chatId: notification.chat?._id,
                groupId: notification.group?._id,
            });

            refreshNotifications();

            closeDropdown();

            navigate("/", {
                state: {
                    chatId: notification.chat?._id || null,
                    groupId: notification.group?._id || null,
                },
            });

        } catch (error) {
            console.log(error);
        }
    };

    const messageText =
        notification.type === "group-message"
            ? "sent a message in your group"
            : "sent you a message";

    const time = new Date(
        notification.createdAt,
    ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div
            onClick={handleClick}
            className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 border-b border-white/5 cursor-pointer transition hover:bg-white/10 active:bg-white/20 ${notification.isRead
                ? "bg-transparent"
                : "bg-blue-500/10"
                }`}
        >
            <img
                src={
                    notification.sender?.profileImage ||
                    `https://ui-avatars.com/api/?name=${notification.sender?.userName}&size=64`
                }
                alt=""
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-white break-words">
                    <span className="font-bold">
                        {notification.sender?.userName}
                    </span>{" "}
                    <span className="break-words">{messageText}</span>
                </p>

                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">
                    {time}
                </p>
            </div>

            {!notification.isRead && (
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-blue-500 flex-shrink-0" />
            )}
        </div>
    );
}

export default NotificationItem;