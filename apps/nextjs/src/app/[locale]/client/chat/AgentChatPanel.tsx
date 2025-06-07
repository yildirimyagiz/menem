"use client";

import { useState } from "react";

import { useChat } from "~/context/ChatContext";

export function AgentChatPanel() {
  const { messages, supportAgents, sendMessage } = useChat();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  // Group messages by threadId (or guest)
  const threadMap = new Map<string, typeof messages>();
  messages.forEach((msg) => {
    const threadId = msg.threadId ?? msg.senderId;
    if (!threadMap.has(threadId)) threadMap.set(threadId, []);
    // Avoid non-null assertion by checking
    const arr = threadMap.get(threadId);
    if (arr) arr.push(msg);
  });
  const threads = Array.from(threadMap.entries());

  const handleSend = async () => {
    if (!selectedThreadId || !reply.trim()) return;
    // Find the receiverId (guest) from the thread
    const threadMsgs =
      threads.find(([id]) => id === selectedThreadId)?.[1] ?? [];
    // Find the last message not from the agent
    const guestMsg = threadMsgs.find(
      (msg) => !supportAgents.some((agent) => agent.id === msg.senderId),
    );
    const guestId = guestMsg?.senderId ?? threadMsgs[0]?.senderId;
    if (!guestId) return;
    await sendMessage(reply, guestId, selectedThreadId);
    setReply("");
  };

  return (
    <div style={{ display: "flex", height: 500, border: "1px solid #ccc" }}>
      {/* Thread List */}
      <div
        style={{ width: 220, borderRight: "1px solid #eee", overflowY: "auto" }}
      >
        {threads.length === 0 && (
          <div style={{ padding: 16, color: "#888" }}>
            No guest conversations
          </div>
        )}
        {threads.map(([threadId, msgs]) => (
          <div
            key={threadId}
            style={{
              padding: 8,
              background: selectedThreadId === threadId ? "#f0f0f0" : undefined,
              cursor: "pointer",
              borderBottom: "1px solid #f5f5f5",
            }}
            onClick={() => setSelectedThreadId(threadId)}
          >
            <strong>{msgs[0]?.metadata?.senderName ?? "Guest"}</strong>
            <br />
            <small style={{ color: "#888" }}>
              {msgs.length > 0
                ? msgs[msgs.length - 1]?.content.slice(0, 30)
                : ""}
            </small>
          </div>
        ))}
      </div>
      {/* Chat Window */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
          {selectedThreadId ? (() => {
            const selectedMsgs = threads.find(([id]) => id === selectedThreadId)?.[1] ?? [];
            return selectedMsgs.length > 0 ? (
              selectedMsgs.map((msg) => (
                <div key={msg.id} style={{ margin: "8px 0" }}>
                  <b>{
                    supportAgents.some((agent) => agent.id === msg.senderId)
                      ? "You"
                      : msg.metadata?.senderName ?? "Guest"
                  }:</b>
                  <span> {msg.content}</span>
                </div>
              ))
            ) : (
              <div style={{ color: "#888" }}>No messages in this thread.</div>
            );
          })() : (
            <div style={{ color: "#888", padding: 16 }}>Select a conversation to view messages.</div>
          )}
        </div>
        {/* Reply Box */}
        {selectedThreadId && (
          <div
            style={{ display: "flex", borderTop: "1px solid #eee", padding: 8 }}
          >
            <input
              style={{ flex: 1, marginRight: 8 }}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your reply..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentChatPanel;
