import { useEffect, useRef, useState } from "react";
import { IoNotifications } from "react-icons/io5";

import { useChat } from "../../context/ChatContext";

import {
    getNotifications,
} from "../../services/notificationService";

import NotificationDropdown from "./NotificationDropdown";

function NotificationBell() {
    const { socket } = useChat();

    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    const bellRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await getNotifications();

            setNotifications(res.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleNotification = () => {
            fetchNotifications();
        };

        socket.on("new-notification", handleNotification);

        return () => {
            socket.off("new-notification", handleNotification);
        };
    }, [socket]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                bellRef.current &&
                !bellRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside,
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside,
            );
        };
    }, []);

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead,
    ).length;

    return (
        <div
            ref={bellRef}
            className="relative"
        >
            <button
                onClick={() => setOpen(!open)}
                className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition flex items-center justify-center shadow-lg shadow-black/20"
            >
                <IoNotifications className="text-xl sm:text-2xl md:text-2xl text-white" />

                {unreadCount > 0 && (
                    <span
                        className="
            absolute
            -top-0.5
            -right-0.5
            sm:-top-1
            sm:-right-1
            min-w-[18px]
            sm:min-w-[20px]
            h-[18px]
            sm:h-5
            px-1
            rounded-full
            bg-red-600
            text-white
            text-[9px]
            sm:text-[10px]
            md:text-[11px]
            font-bold
            flex
            items-center
            justify-center
            shadow-lg
            shadow-red-600/30
            animate-pulse
          "
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <NotificationDropdown
                    notifications={notifications}
                    refreshNotifications={fetchNotifications}
                    closeDropdown={() => setOpen(false)}
                />
            )}
        </div>
    );
}

export default NotificationBell;