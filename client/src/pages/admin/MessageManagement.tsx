import {
  Archive,
  Flag,
  Funnel,
  MessageSquareDot,
  MessageSquareText,
  OctagonAlert,
  RotateCw,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useState, type FC, type ReactNode } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { messagesData } from "../../constants/messagesData";

const MessageManagement: FC = () => {
  const [keyword, setKeyword] = useState("");
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [dateFrom, setDateFrom] = useState("");

  // applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: "",
    sender: "",
    receiver: "",
    dateFrom: "",
  });

  const filteredMessages = messagesData.filter((msg) => {
    const msgDate = new Date(msg.createdAt);

    const matchesKeyword =
      !appliedFilters.keyword ||
      msg.content.toLowerCase().includes(appliedFilters.keyword);

    const matchesSender =
      !appliedFilters.sender ||
      msg.sender.name.toLowerCase().includes(appliedFilters.sender);

    const matchesReceiver =
      !appliedFilters.receiver ||
      (msg.groupId ?? msg.reciever)
        .toLowerCase()
        .includes(appliedFilters.receiver);

    const matchesDate =
      !appliedFilters.dateFrom || msgDate >= new Date(appliedFilters.dateFrom);

    return matchesKeyword && matchesSender && matchesReceiver && matchesDate;
  });

  return (
    <AdminLayout>
      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ================= APP BAR ================= */}
        <div className="col-span-1 lg:col-span-4 w-full bg-white px-8 py-6 border-b border-zinc-200">
          <div className="flex items-start justify-center flex-col">
            <h2 className="text-[1.275rem] font-bold">Message Audit Log</h2>
            <p className="text-[.8rem] text-text-light">
              Audit and monitor all platform communications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 col-span-1 lg:col-span-4 gap-6 px-4 sm:px-6 lg:px-8">
          <StatCard
            title={"Total Messages"}
            value={1245678}
            icon={<MessageSquareText className="text-primary" />}
          />
          <StatCard
            title={"Messages Today"}
            value={12842}
            icon={<MessageSquareDot className="text-primary" />}
          />
          <StatCard
            title={"Flagged Messages"}
            value={156}
            icon={<Flag className="text-primary" />}
          />
          <StatCard
            title={"Flagged Today"}
            value={23}
            icon={<OctagonAlert className="text-primary" />}
          />

          <div className="col-span-1 lg:col-span-4 p-6 pb-10 rounded-xl bg-white border border-zinc-200">
            <h2 className="flex items-center justify-start gap-2 font-extrabold text-[0.9rem] uppercase tracking-wide text-zinc-700 mb-4">
              <SlidersHorizontal size={16} /> Advanced Filtering
            </h2>

            <div className="h-full w-full flex items-center justify-between">
              {/* Date Range */}
              <div className="flex items-start justify-center flex-col gap-1">
                <label
                  htmlFor="date"
                  className="text-xs font-semibold tracking-wider uppercase text-text-light"
                >
                  Date Range
                </label>
                <input
                  className="w-full px-3 py-2 rounded-xl bg-[#f6f8f4] text-text 
                   placeholder:text-[#9b988c] placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  type="date"
                  name="date"
                  id="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              {/* Keywords */}
              <div className="flex items-start justify-center flex-col gap-1">
                <label
                  htmlFor="keyword"
                  className="text-xs font-semibold tracking-wider uppercase text-text-light"
                >
                  Keywords
                </label>
                <input
                  className="w-full px-3 py-2 rounded-xl bg-[#f6f8f4] text-text 
                   placeholder:text-[#9b988c] placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  type="text"
                  placeholder="Search content..."
                  name="keyword"
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              {/* Sender */}
              <div className="flex items-start justify-center flex-col gap-1">
                <label
                  htmlFor="sender"
                  className="text-xs font-semibold tracking-wider uppercase text-text-light"
                >
                  Sender
                </label>
                <input
                  className="w-full px-3 py-2 rounded-xl bg-[#f6f8f4] text-text 
                   placeholder:text-[#9b988c] placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  type="text"
                  placeholder="@username"
                  name="sender"
                  id="sender"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                />
              </div>
              {/* Receiver/Group */}
              <div className="flex items-start justify-center flex-col gap-1">
                <label
                  htmlFor="receiver"
                  className="text-xs font-semibold tracking-wider uppercase text-text-light"
                >
                  Receiver/Group
                </label>
                <input
                  className="w-full px-3 py-2 rounded-xl bg-[#f6f8f4] text-text 
                   placeholder:text-[#9b988c] placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  type="text"
                  placeholder="User or Group ID"
                  name="receiver"
                  id="receiver"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                />
              </div>

              <div className="h-full flex items-center justify-end flex-col pb-5">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setKeyword("");
                      setSender("");
                      setReceiver("");
                      setDateFrom("");
                      setAppliedFilters({
                        keyword: "",
                        sender: "",
                        receiver: "",
                        dateFrom: "",
                      });
                    }}
                    className="bg-accent text-text-light hover:bg-accent/70 transition-colors p-3 rounded-xl cursor-pointer"
                  >
                    <RotateCw size={14} />
                  </button>
                  <button
                    onClick={() =>
                      setAppliedFilters({
                        keyword: keyword.toLowerCase(),
                        sender: sender.toLowerCase(),
                        receiver: receiver.toLowerCase(),
                        dateFrom,
                      })
                    }
                    className="flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-xl text-xs  tracking-wider font-semibold uppercase cursor-pointer"
                  >
                    <Funnel size={14} /> Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div className="mb-8 col-span-1 lg:col-span-4 rounded-xl border border-slate-200 bg-white overflow-hidden">
            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-100">
                    <th className="px-6 py-3">Sender</th>
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
                      Attachments
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
                      Receiver / Group
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
                      Sent At
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filteredMessages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-zinc-50">
                      {/* Sender */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={msg.sender.avatar}
                            alt="Sender's Avatar"
                            className="h-9 w-9 rounded-full border"
                          />
                          <span className="font-medium">{msg.sender.name}</span>
                        </div>
                      </td>

                      {/* Message */}
                      <td className="px-6 py-4 max-w-xs truncate text-sm">
                        {msg.content}
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4 text-sm">
                        {msg.groupId ? "Group" : "Private"}
                      </td>

                      {/* Attachments */}
                      <td className="px-6 py-4 text-sm">
                        {msg.attachments.length}
                      </td>

                      {/* Receiver / Group */}
                      <td className="px-6 py-4 text-xs font-mono">
                        {msg.groupId ?? msg.reciever}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm">
                        {new Date(msg.createdAt).toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            className={`p-2 rounded-lg ${
                              msg.isFlagged
                                ? "text-red-500 bg-red-500/10"
                                : "hover:bg-zinc-100"
                            }`}
                            title="Flag Message"
                          >
                            <Flag size={18} />
                          </button>

                          <button className="p-2 hover:bg-zinc-100 rounded-lg">
                            <Archive size={18} />
                          </button>

                          <button className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg">
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
                Showing 1 to {filteredMessages.length} of {messagesData.length}{" "}
                messages
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

export default MessageManagement;
