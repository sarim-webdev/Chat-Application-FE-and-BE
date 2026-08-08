import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ChatWindow from "../components/chat/ChatWindow";
import { addContact, getContacts } from "../services/contactService";
import { logoutUser } from "../services/authService";
import { useChat } from "../context/ChatContext";
import GroupWindow from "../components/group/GroupWindow";
import { getGroups } from "../services/groupService";
import useGroup from "../hooks/useGroup";
import { useLocation } from "react-router-dom";
import CreateGroupModal from "../components/group/CreateGroupModal";
import GroupInfoModal from "../components/group/GroupInfoModal";
import AddMemberModal from "../components/group/AddMemberModal";
import RenameGroupModal from "../components/group/RenameGroupModal";
import RemoveMemberModal from "../components/group/RemoveMemberModal";
import ChangeAdminModal from "../components/group/ChangeAdminModal";
import LeaveGroupModal from "../components/group/LeaveGroupModal";
import UpdateGroupImageModal from "../components/group/UpdateGroupImageModal";
import DeleteGroupModal from "../components/group/DeleteGroupModal";
import NotificationBell from "../components/Notification/NotificationBell";
import IncomingCallModal from "../components/Call/IncomingCallModal";
import OutgoingCallModal from "../components/Call/OutgoingCallModal";
import CallScreen from "../components/Call/CallScreen";
import { FaChevronRight } from "react-icons/fa";

function Home() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useChat();

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chats");
  const [selectedChat, setSelectedChat] = useState(null);
  const { selectedGroup, setSelectedGroup } = useGroup();
  const { createModalOpen, setCreateModalOpen } = useGroup();

  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { groups, fetchGroups, loading } = useGroup();
  const [contactModal, setContactModal] = useState(false);
  const [contactEmail, setContactEmail] = useState("");

  const handleLogout = async () => {
    try {
      await logoutUser();

      setUser(null);

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchContacts = async () => {
    try {
      setContactsLoading(true);

      const res = await getContacts();

      setContacts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setContactsLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = () => {
      fetchContacts();
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("contacts-updated", () => {

      fetchContacts();
    });

    return () => {
      socket.off("contacts-updated");
    };
  }, [socket]);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    socket.on("groups-updated", () => {
      fetchGroups();
    });

    return () => {
      socket.off("groups-updated");
    };
  }, []);

  useEffect(() => {
    if (!location.state) return;

    if (location.state.chatId && contacts.length > 0) {
      const contact = contacts.find(
        (c) => c.chatId._id === location.state.chatId
      );

      if (contact) {
        setSelectedGroup(null);

        setSelectedChat({
          _id: contact.chatId._id,
          user: contact.contactUser,
        });

        setActiveTab("chats");
      }
    }

    if (location.state.groupId && groups.length > 0) {
      const group = groups.find(
        (g) => g._id === location.state.groupId
      );

      if (group) {
        setSelectedChat(null);

        setSelectedGroup(group);

        setActiveTab("groups");
      }
    }

    navigate(location.pathname, {
      replace: true,
      state: null,
    });

  }, [location.state, contacts, groups]);

  const handleAddContact = async () => {
    try {
      await addContact(contactEmail);

      setContactEmail("");
      setContactModal(false);

      fetchContacts();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="h-screen flex bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#1E293B] text-white relative">

      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-16 left-4 z-50 p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg lg:hidden"
        >
          <FaChevronRight className="text-white text-xl" />
        </button>
      )}

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`
      w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col
      transition-all duration-300 ease-in-out
      ${isMobile ? 'fixed top-0 left-0 h-full z-50' : 'relative'}
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0 lg:static lg:h-full
    `}>

        <div className="p-3 flex gap-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === "chats"
              ? "bg-blue-600"
              : "bg-white/5 hover:bg-white/10"
              }`}
          >
            💬 Chats
          </button>

          <button
            onClick={() => setActiveTab("groups")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === "groups"
              ? "bg-blue-600"
              : "bg-white/5 hover:bg-white/10"
              }`}
          >
            👥 Groups
          </button>

          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === "chats" && (
            <div className="space-y-3">
              <button
                onClick={() => setContactModal(true)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold"
              >
                + New Contact
              </button>

              <h2 className="text-gray-400 text-xs uppercase">
                Contacts
              </h2>

              {contactsLoading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="relative">
                    <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
                  </div>
                  <p className="mt-5 text-gray-300 tracking-wide">
                    Loading Contacts...
                  </p>
                </div>
              ) : contacts.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No contacts yet
                </p>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact._id}
                    onClick={() => {
                      setSelectedGroup(null);
                      setSelectedChat({
                        _id: contact.chatId._id,
                        user: contact.contactUser,
                      });
                      if (isMobile) setIsSidebarOpen(false);
                    }}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          contact.contactUser?.profileImage ||
                          `https://ui-avatars.com/api/?name=${contact.contactUser?.userName}`
                        }
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold truncate">
                            {contact.contactUser?.userName}
                          </p>

                          {contact.unreadCount > 0 && (
                            <span className="bg-green-500 text-white text-[10px] min-w-[22px] h-[22px] rounded-full flex items-center justify-center font-bold flex-shrink-0 ml-2">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 truncate">
                          {contact.contactUser?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "groups" && (
            <div className="space-y-3">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition"
              >
                + New Group
              </button>

              <h2 className="text-gray-400 text-xs uppercase">
                Groups
              </h2>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="relative">
                    <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
                  </div>
                  <p className="mt-5 text-gray-300 tracking-wide">
                    Loading Groups...
                  </p>
                </div>
              ) : groups.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No groups yet
                </p>
              ) : (
                groups.map((group) => (
                  <div
                    key={group._id}
                    onClick={() => {
                      setSelectedGroup(group);
                      setSelectedChat(null);
                      if (isMobile) setIsSidebarOpen(false);
                    }}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          group.groupImage ||
                          `https://ui-avatars.com/api/?name=${group.groupName}`
                        }
                        alt={group.groupName}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold truncate">
                            {group.groupName}
                          </p>

                          {group.unreadCount > 0 && (
                            <span className="bg-green-500 text-white text-[10px] min-w-[22px] h-[22px] rounded-full flex items-center justify-center font-bold flex-shrink-0 ml-2">
                              {group.unreadCount}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-400">
                          {group.members?.length} Members
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 relative">
          <div className="flex items-center gap-2">
            <div
              onClick={() => setOpen(!open)}
              className="flex-1 flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-xl min-w-0"
            >
              <img
                src={
                  user?.profileImage ||
                  "https://ui-avatars.com/api/?name=" + user?.userName
                }
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                alt="profile"
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user?.userName}
                </p>
                <p className="text-xs text-green-400">
                  Online
                </p>
              </div>
            </div>

            <NotificationBell />
          </div>

          {open && (
            <div className="absolute bottom-16 left-4 w-48 bg-[#111827] border border-white/10 rounded-xl shadow-xl z-50">
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-4 py-3 hover:bg-white/10"
              >
                👤 Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-red-500/20 text-red-400"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} fetchContacts={fetchContacts} />
        ) : selectedGroup ? (
          <GroupWindow />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 p-4 text-center">
            <div>
              {isMobile ? (
                <p className="text-sm">👈 Select a chat or group</p>
              ) : (
                <p>Select a chat or group</p>
              )}
            </div>
          </div>
        )}
      </div>

      {contactModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] w-full max-w-md p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold mb-4">New Contact</h2>

            <input
              type="email"
              placeholder="Enter user email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full mb-4 p-3 bg-white/10 rounded-xl outline-none"
            />

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleAddContact}
                className="flex-1 min-w-[100px] bg-green-600 py-2 rounded-xl hover:bg-green-700 transition"
              >
                Save
              </button>

              <button
                onClick={() => setContactModal(false)}
                className="flex-1 min-w-[100px] bg-white/10 py-2 rounded-xl hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateGroupModal />
      <GroupInfoModal />
      <RenameGroupModal />
      <AddMemberModal />
      <RemoveMemberModal />
      <ChangeAdminModal />
      <DeleteGroupModal />
      <LeaveGroupModal />
      <UpdateGroupImageModal />
      <IncomingCallModal />
      <OutgoingCallModal />
      <CallScreen />
    </div>
  );
}

export default Home;
