import { useEffect, useMemo, useState } from "react";

import API from "../../services/api";

import useGroup from "../../hooks/useGroup";
import useAuth from "../../hooks/useAuth";
import { getContacts } from "../../services/contactService";

function AddMemberModal() {
  const { user } = useAuth();

  const {
    selectedGroup,

    addMember,

    loading,

    addMemberModalOpen,
    setAddMemberModalOpen,
  } = useGroup();

  const [contacts, setContacts] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [fetchingUsers, setFetchingUsers] = useState(false);

  const fetchContacts = async () => {
    try {
      setFetchingUsers(true);

      const res = await getContacts();

      setContacts(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingUsers(false);
    }
  };

  useEffect(() => {
    if (addMemberModalOpen) {
      fetchContacts();
    }
  }, [addMemberModalOpen]);

  const filteredUsers = useMemo(() => {
    if (!selectedGroup) return [];

    return contacts.filter((contact) => {
      const contactUser = contact.contactUser;

      if (contactUser._id === user._id) return false;

      const alreadyMember = selectedGroup.members.some(
        (member) => member._id === contactUser._id,
      );

      if (alreadyMember) return false;

      return (
        contactUser.userName.toLowerCase().includes(search.toLowerCase()) ||
        contactUser.email.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [contacts, search, selectedGroup, user]);

  const toggleUser = (userId) => {

    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }

      return [...prev, userId];
    });
  };

  const handleAddMembers = async () => {
    try {
      if (selectedUsers.length === 0) return;

      for (const userId of selectedUsers) {
        await addMember(selectedGroup._id, userId);
      }

      setSelectedUsers([]);
      setSearch("");
      setAddMemberModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setSearch("");
    setAddMemberModalOpen(false);
  };

  if (!addMemberModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg mx-2 sm:mx-3 md:mx-4 bg-[#111827] rounded-2xl border border-white/10 p-4 sm:p-5 md:p-6 max-h-[90vh] flex flex-col">

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Add Members</h2>

        <div className="flex-1 min-h-0 space-y-2 overflow-y-auto">
          {fetchingUsers ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-10">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-3 sm:border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
              </div>
              <p className="mt-3 sm:mt-4 text-gray-300 text-xs sm:text-sm">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-gray-400 py-8 sm:py-10 text-sm sm:text-base">
              No users found
            </p>
          ) : (
            filteredUsers.map((contact) => {
              const user = contact.contactUser;

              return (
                <label
                  key={user._id}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border-b border-white/10 hover:bg-white/5 active:bg-white/10 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleUser(user._id)}
                    className="accent-blue-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 cursor-pointer"
                  />

                  <img
                    src={
                      user.profileImage ||
                      `https://ui-avatars.com/api/?name=${user.userName}&size=64`
                    }
                    alt={user.userName}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium truncate">
                      {user.userName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  {selectedUsers.includes(user._id) && (
                    <span className="text-green-400 text-xs sm:text-sm font-medium flex-shrink-0">
                      ✓ Selected
                    </span>
                  )}
                </label>
              );
            })
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/10">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-2 rounded-lg bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-sm sm:text-base font-medium transition"
          >
            Cancel
          </button>

          <button
            onClick={handleAddMembers}
            disabled={loading}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-sm sm:text-base font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : (
              "Add Members"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMemberModal;
