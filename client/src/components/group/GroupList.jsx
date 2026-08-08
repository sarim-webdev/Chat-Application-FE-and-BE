import { useEffect } from "react";

import useGroup from "../../hooks/useGroup";

import GroupCard from "./GroupCard";

function GroupList() {
  const {
    groups,
    loading,
    search,
    setSearch,

    selectedGroup,
    setSelectedGroup,

    fetchGroups,

    setCreateModalOpen,
  } = useGroup();

  useEffect(() => {
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.groupName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#111827] border-r border-white/10">

      <div className="p-4 border-b border-white/10">

        <div className="flex items-center justify-between">

          <h2 className="text-lg font-bold text-white">
            Groups
          </h2>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm"
          >
            +
          </button>

        </div>

        <input
          type="text"
          placeholder="Search group..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mt-4 px-3 py-2 rounded-lg bg-[#1F2937] text-white outline-none border border-white/10 focus:border-blue-500"
        />

      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">

        {loading && (
          <div className="text-center text-gray-400 mt-10">
            Loading...
          </div>
        )}

        {!loading && filteredGroups.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No Groups Found
          </div>
        )}

        {!loading &&
          filteredGroups.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
            />
          ))}

      </div>

    </div>
  );
}

export default GroupList;