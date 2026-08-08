import { useState } from "react";

import useGroup from "../../hooks/useGroup";
import { useEffect } from "react";
import { getContacts } from "../../services/contactService";

function CreateGroupModal() {
  const { createModalOpen, setCreateModalOpen, setGroups, createGroup } = useGroup();

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [groupImage, setGroupImage] = useState("");
  const [contacts, setContacts] = useState([]);
  const [members, setMembers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      return alert("Group name is required");
    }

    try {
      const res = await createGroup({
        groupName,
        description,
        groupImage,
        members,
      });

      setGroups((prev) => [res.data, ...prev]);

      setGroupName("");
      setDescription("");
      setGroupImage("");
      setMembers([]);

      setCreateModalOpen(false);
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Failed to create group");
    }
  };

  const toggleMember = (userId) => {
    setMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await getContacts();
        setContacts(res.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    if (createModalOpen) {
      fetchContacts();
    }
  }, [createModalOpen]);

  if (!createModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-2 sm:mx-3 md:mx-4 bg-[#111827] rounded-2xl border border-white/10 p-4 sm:p-5 md:p-6 max-h-[90vh] flex flex-col">

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6">
          Create Group
        </h2>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-3 sm:space-y-4 overflow-y-auto">

          <div>
            <label className="text-xs sm:text-sm text-gray-300 font-medium">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full mt-1 p-2.5 sm:p-3 rounded-xl bg-[#1F2937] border border-white/10 outline-none text-white text-sm sm:text-base focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm text-gray-300 font-medium">Description</label>
            <textarea
              rows={2.5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Group description..."
              className="w-full mt-1 p-2.5 sm:p-3 rounded-xl bg-[#1F2937] border border-white/10 outline-none text-white text-sm sm:text-base resize-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm text-gray-300 font-medium">Group Image URL</label>
            <input
              type="text"
              value={groupImage}
              onChange={(e) => setGroupImage(e.target.value)}
              placeholder="https://..."
              className="w-full mt-1 p-2.5 sm:p-3 rounded-xl bg-[#1F2937] border border-white/10 outline-none text-white text-sm sm:text-base focus:border-blue-500 transition"
            />
          </div>

          <div className="flex-1 min-h-0">
            <label className="text-xs sm:text-sm text-gray-300 font-medium">Select Members</label>

            <div className="mt-1.5 sm:mt-2 max-h-36 sm:max-h-40 md:max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-[#1F2937]">
              {contacts.length === 0 ? (
                <p className="p-3 sm:p-4 text-gray-400 text-xs sm:text-sm text-center">No contacts found</p>
              ) : (
                contacts.map((contact) => (
                  <label
                    key={contact._id}
                    className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 active:bg-white/10 transition"
                  >
                    <input
                      type="checkbox"
                      checked={members.includes(contact.contactUser._id)}
                      onChange={() => toggleMember(contact.contactUser._id)}
                      className="accent-blue-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 cursor-pointer"
                    />

                    <img
                      src={
                        contact.contactUser.profileImage ||
                        `https://ui-avatars.com/api/?name=${contact.contactUser.userName}&size=64`
                      }
                      alt=""
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base text-white truncate">
                        {contact.contactUser.userName}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                        {contact.contactUser.email}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
            <button
              type="submit"
              className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 py-2.5 sm:py-3 rounded-xl font-semibold text-white text-sm sm:text-base transition"
            >
              Create
            </button>

            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="w-full sm:flex-1 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 py-2.5 sm:py-3 rounded-xl font-semibold text-white text-sm sm:text-base transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateGroupModal;
