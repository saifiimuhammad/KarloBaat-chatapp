import { useEffect, useState, type FC, type ReactNode } from "react";
import {
  Archive,
  MessageSquareText,
  MessagesSquare,
  Pencil,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import chatsData from "../../constants/chatsData";

const ChatManagement: FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "private" | "groups"
  >("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const filteredChats = chatsData.filter((chat) => {
    const searchValue = debouncedSearch.toLowerCase();

    const matchesSearch =
      chat.name.toLowerCase().includes(searchValue) ||
      chat.members.some((m) => m.toLowerCase().includes(searchValue)) ||
      (chat.admin?.name.toLowerCase().includes(searchValue) ?? false);

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "private"
        ? !chat.isGroupChat
        : chat.isGroupChat;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ================= APP BAR ================= */}
        <div className="col-span-1 lg:col-span-4 w-full bg-white px-8 py-6 border-b border-zinc-200">
          <div className="flex items-start justify-center flex-col">
            <h2 className="text-[1.275rem] font-bold">Chat Management</h2>
            <p className="text-[.8rem] text-text-light">
              Monitor and moderate active conversations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 col-span-1 lg:col-span-4 gap-6 px-4 sm:px-6 lg:px-8">
          <StatCard
            title={"Total Chats"}
            value={8432}
            icon={<MessagesSquare className="text-primary" />}
          />
          <StatCard
            title={"Active Chats Today"}
            value={1284}
            icon={<MessageSquareText className="text-primary" />}
          />
          <StatCard
            title={"New Groups Today"}
            value={42}
            icon={<Users className="text-primary" />}
          />
          <StatCard
            title={"Archived Chats"}
            value={315}
            icon={<Archive className="text-primary" />}
          />

          {/* ================= TABLE ================= */}
          <div className="mb-8 col-span-1 lg:col-span-4 rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="w-full md:max-w-3xl relative">
                  <div
                    className={`absolute left-3 top-5 -translate-y-1/2 text-[#9b988c] ${
                      isActive ? "text-text/70" : ""
                    }`}
                  >
                    <Search size={16} />
                  </div>
                  <input
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#f6f8f4] text-text 
                   placeholder:text-[#9b988c] placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search by chat name or member..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsActive(true)}
                    onBlur={() => setIsActive(false)}
                  />
                </div>
                {/* Status Filter Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-text-light">
                    Filter by type:
                  </span>
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors ${
                      statusFilter === "all"
                        ? "text-primary"
                        : "bg-zinc-100 text-text-light hover:bg-zinc-200"
                    } cursor-pointer`}
                  >
                    <span>All</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter("private")}
                    className={`flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors ${
                      statusFilter === "private"
                        ? "text-primary"
                        : "bg-zinc-100 text-text-light hover:bg-zinc-200"
                    } cursor-pointer`}
                  >
                    <span>Private</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter("groups")}
                    className={`flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors ${
                      statusFilter === "groups"
                        ? "text-primary"
                        : "bg-zinc-100 text-text-light hover:bg-zinc-200"
                    } cursor-pointer`}
                  >
                    <span>Groups</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-100">
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
                      Avatar
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
                      Chat Name
                    </th>

                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
                      Members
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filteredChats.map((chat) => (
                    <tr
                      key={chat.id}
                      className="hover:bg-zinc-50 transition-colors"
                    >
                      {/* Avatar */}
                      <td className="px-6 py-4">
                        {Array.isArray(chat.avatar) ? (
                          <div className="flex -space-x-2">
                            {chat.avatar.slice(0, 3).map((av, i) => (
                              <img
                                key={i}
                                src={av}
                                className="h-8 w-8 rounded-full border border-white"
                              />
                            ))}
                          </div>
                        ) : (
                          <img
                            src={chat.avatar}
                            className="h-10 w-10 rounded-full border"
                          />
                        )}
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4 font-semibold">{chat.name}</td>

                      {/* Type */}
                      <td className="px-6 py-4 text-sm">
                        {chat.isGroupChat ? "Group" : "Private"}
                      </td>

                      {/* Members */}
                      <td className="px-6 py-4 text-sm">{chat.totalMembers}</td>

                      {/* Admin (GROUP ONLY) */}
                      <td className="px-6 py-4">
                        {chat.isGroupChat && chat.admin ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="h-8 w-8 rounded-full border bg-cover bg-center"
                              style={{
                                backgroundImage: `url('${chat.admin.avatar}')`,
                              }}
                            />
                            <span className="text-sm font-medium">
                              {chat.admin.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-text-light">—</span>
                        )}
                      </td>
                      {/* Created */}
                      <td className="px-6 py-4 text-sm">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            className="p-2 hover:text-primary hover:bg-primary/10 rounded-lg"
                            title="Edit Chat"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            className="p-2 hover:text-zinc-600 hover:bg-zinc-200 rounded-lg"
                            title="Archive Chat"
                          >
                            <Archive size={18} />
                          </button>

                          <button
                            className="p-2 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                            title="Delete Chat"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-zinc-200 flex items-center justify-between">
              <span className="text-sm text-text-light">
                Showing 1 to {filteredChats.length} of {chatsData.length} chats
              </span>
              <div className="flex gap-1">
                <button className="h-8 px-3 rounded-lg border border-zinc-200 text-sm font-medium hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                  Previous
                </button>
                <button className="h-8 w-8 rounded-lg bg-primary text-white text-sm font-bold shadow-sm cursor-pointer">
                  1
                </button>
                <button className="h-8 w-8 rounded-lg border border-zinc-200 text-sm font-medium hover:bg-zinc-100 cursor-pointer">
                  2
                </button>
                <button className="h-8 w-8 rounded-lg border border-zinc-200 text-sm font-medium hover:bg-zinc-100 cursor-pointer">
                  3
                </button>
                <button className="h-8 px-3 rounded-lg border border-zinc-200 text-sm font-medium hover:bg-zinc-100 cursor-pointer">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="col-span-1 flex flex-col gap-2 rounded-xl p-6 bg-white border border-zinc-200">
      <div className="flex items-center justify-between">
        <p className="text-text-light text-sm font-medium">{title}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold leading-tight">
        {value.toLocaleString()}
      </p>
    </div>
  );
};

export default ChatManagement;
