import { useState, useRef, useEffect } from "react";

const API_URL = "http://localhost:3001";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 144) + "px";
  }, [message]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    const userMsg = message;
    setMessage("");
    setLoading(true);
    setChat((prev) => [...prev, { role: "user", text: userMsg }]);
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, sessionId }),
      });
      const data = await res.json();
      setSessionId(data.sessionId);
      setChat((prev) => [...prev, { role: "agent", text: data.reply }]);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "agent", text: "Ops! Não consegui responder. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const recentChats = [
    "UI/UX Design",
    "Programação Frontend",
    "Programação Backend",
    "Tecnologia Web",
    "Banco de Dados",
    "DevOps e Infraestrutura",
    "Segurança da Informação",
    "Acessibilidade Web",
    "Performance e Otimização",
    "Testes e QA",
    "Design Responsivo",
  ];

  return (
    <div className="flex h-screen bg-pink-50 overflow-hidden">

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-pink-50 border-r border-pink-200 transition-transform duration-300 " +
          (sidebarOpen ? "translate-x-0" : "-translate-x-full") +
          " md:relative md:translate-x-0 md:flex md:shrink-0"
        }
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-pink-200">
          <span className="font-semibold text-pink-800 text-sm">Nina IA</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-lg text-pink-500 hover:bg-pink-100"
          >
            <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New chat / Search */}
        <div className="px-3 py-3 flex flex-col gap-1">
          <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-pink-900 rounded-lg hover:bg-pink-100 transition-colors">
            <svg className="size-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Novo chat
          </a>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-pink-900 rounded-lg hover:bg-pink-100 transition-colors">
            <svg className="size-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
            Procurar chat
          </button>
        </div>

        {/* Recent chats */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <span className="block px-3 mb-2 text-xs text-pink-400 font-medium uppercase tracking-wide">
            Chats Recentes
          </span>
          <ul className="flex flex-col gap-0.5">
            {recentChats.map((title) => (
              <li key={title}>
                <a href="#" className="flex items-center px-3 py-2 text-sm text-pink-900 rounded-lg hover:bg-pink-100 transition-colors truncate">
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex flex-col flex-1 min-w-0 h-screen">

        {/* HEADER */}
        <header className="shrink-0 flex items-center gap-3 px-4 sm:px-6 py-3 bg-pink-50 border-b border-pink-200 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-pink-600 hover:bg-pink-100 transition-colors"
          >
            <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-pink-800 text-base truncate">Nina IA</span>
        </header>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4 min-h-full">

            {/* Welcome */}
            {chat.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center flex-1 py-20">
                <h1 className="text-2xl sm:text-3xl text-center text-pink-800 font-medium leading-snug">
                  Vamos conversar sobre o que hoje?
                </h1>
                <p className="mt-3 text-sm text-pink-400 text-center">
                  Digite sua mensagem abaixo para começar
                </p>
              </div>
            )}

            {/* Messages */}
            {chat.map((msg, i) => (
              <div
                key={i}
                className={"flex items-end gap-2 " + (msg.role === "user" ? "flex-row-reverse" : "flex-row")}
              >
                <div className={"shrink-0 flex items-center justify-center size-8 rounded-full text-xs font-semibold " + (msg.role === "user" ? "bg-pink-300 text-pink-900" : "bg-pink-200 text-pink-800")}>
                  {msg.role === "user" ? "U" : "N"}
                </div>
                <div
                  style={{ maxWidth: "75%" }}
                  className={"px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words " + (msg.role === "user" ? "bg-pink-700 text-white rounded-br-sm" : "bg-white border border-pink-100 text-pink-900 rounded-bl-sm shadow-sm")}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="flex items-center justify-center size-8 rounded-full bg-pink-200 text-pink-800 text-xs font-semibold shrink-0">
                  N
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-pink-100 shadow-sm flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "-0.3s" }}></span>
                  <span className="size-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "-0.15s" }}></span>
                  <span className="size-1.5 rounded-full bg-pink-400 animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* INPUT */}
        <div className="shrink-0 px-4 sm:px-6 py-3 sm:py-4 bg-pink-50 border-t border-pink-100">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 bg-white border border-pink-300 rounded-2xl shadow-sm px-4 py-3 focus-within:border-pink-400 transition-all">
              <textarea
                ref={textareaRef}
                className="flex-1 resize-none bg-transparent text-sm text-pink-900 placeholder:text-pink-400 focus:outline-none max-h-36 leading-relaxed"
                placeholder="Converse com a Nina..."
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                className="shrink-0 flex items-center justify-center size-8 rounded-xl bg-pink-700 text-white hover:bg-pink-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m5 12 7-7 7 7M12 19V5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}