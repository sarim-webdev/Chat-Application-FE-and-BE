import NotificationItem from "./NotificationItem";

import {
    markAllNotificationsRead,
} from "../../services/notificationService";

function NotificationDropdown({
    notifications,
    refreshNotifications,
    closeDropdown,
}) {

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();

            refreshNotifications();
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div
            className="
absolute
bottom-14
-right-10
w-[300px]
max-h-[400px]
bg-[#111827]
border
border-white/10
rounded-2xl
shadow-2xl
overflow-hidden
z-[999]
"
        >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white">
                    Notifications
                </h2>

                {notifications.length > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
                    >
                        Mark All Read
                    </button>
                )}
            </div>

            <div className="max-h-[420px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="py-14 flex flex-col items-center justify-center text-gray-400">
                        <div className="text-5xl mb-3">
                            🔔
                        </div>

                        <p className="text-sm">
                            No notifications yet
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <NotificationItem
                            key={notification._id}
                            notification={notification}
                            refreshNotifications={refreshNotifications}
                            closeDropdown={closeDropdown}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default NotificationDropdown;