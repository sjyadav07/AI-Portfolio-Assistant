import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  FiArrowUp,
  FiGithub,
  FiLinkedin,
  FiExternalLink,
  FiCode,
  FiZap,
  FiUser,
  FiCopy,
  FiCheck,
  FiTrash2,
  FiInfo,
  FiX,
  FiAward,
} from "react-icons/fi";
import { LuBot } from "react-icons/lu";

const SUGGESTIONS = [
  {
    label: "Introduce Sachin",
    prompt: "Introduce Sachin",
    icon: <FiUser size={14} className="text-cyan-400 " />,
  },
  {
    label: "Explain his projects",
    prompt: "Explain his projects",
    icon: <FiCode size={14} className="text-cyan-400 " />,
  },
  {
    label: "Technical skills",
    prompt: "What are his technical skills?",
    icon: <FiZap size={14} className="text-cyan-400 " />,
  },
  {
    label: "CGPA & Academics",
    prompt: "Tell me about Sachin's education, college and CGPA",
    icon: <FiAward size={14} className="text-cyan-400 " />,
  },
];

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showMobileBio, setShowMobileBio] = useState(false);

  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  // Textarea auto-sizing capped at 100px
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const nextHeight = Math.min(textarea.scrollHeight, 100);
      textarea.style.height = `${Math.max(nextHeight, 36)}px`;
    }
  }, [question]);

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const clearChat = () => {
    if (loading) return;
    setMessages([]);
    setQuestion("");
    inputRef.current?.focus();
  };

  const sendQuestion = async (event, suggestedQuestion) => {
    event?.preventDefault();

    const userQuestion = (suggestedQuestion ?? question).trim();
    if (!userQuestion || loading) return;

    setQuestion("");
    setLoading(true);
    setShowMobileBio(false);

    const assistantId = crypto.randomUUID();

    setMessages((previous) => [
      ...previous,
      { role: "user", text: userQuestion },
      { id: assistantId, role: "assistant", text: "" },
    ]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      if (!response.body) {
        throw new Error("Streaming response is not available.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        answer += decoder.decode(value, { stream: true });
        const currentAnswer = answer;

        setMessages((previous) =>
          previous.map((message) =>
            message.id === assistantId
              ? { ...message, text: currentAnswer }
              : message,
          ),
        );
      }

      answer += decoder.decode();

      setMessages((previous) =>
        previous.map((message) =>
          message.id === assistantId
            ? { ...message, text: answer || "No response received." }
            : message,
        ),
      );
    } catch (error) {
      setMessages((previous) =>
        previous.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                text: `Unable to get a response. ${error.message} Check that the backend is running and supports streaming.`,
                error: true,
              }
            : message,
        ),
      );
    } finally {
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  return (
    <div className="fixed inset-0 flex h-full w-full overflow-hidden bg-[#07090e] font-sans text-slate-100 antialiased select-none sm:select-auto">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30">
        <div className="absolute -left-32 -top-32 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute -right-32 bottom-0 h-[350px] w-[350px] rounded-full bg-blue-600/10 blur-[130px]" />
      </div>

      {/* Desktop Left Sidebar: Profile Details */}
      <aside className="relative z-10 hidden w-[340px] xl:w-[480px] shrink-0 flex-col justify-between border-r border-white/[0.08] bg-[#090d16] p-5 lg:flex">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 font-bold text-slate-950 shadow-md shadow-cyan-400/20 text-sm">
              SY
            </div>
            <div>
              <h2 className="text-md font-bold text-white tracking-tight">
                Sachin Yadav
              </h2>
              <p className="text-[11px] text-slate-400">Full-Stack Developer</p>
            </div>
          </div>
          <hr className="border-white/10" />
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-2 text-[12px] font-medium text-cyan-300">
            <FiZap size={11} />
            INFORMATION TECHNOLOGY · TCET '27
          </div>

          <p className="text-sm leading-relaxed text-slate-400 mb-6">
            Welcome to my interactive portfolio. Ask my AI assistant anything
            about my projects, technical skills, and academic background.
          </p>

          <div className="flex gap-4 mb-7">
            <a
              href="https://github.com/sjyadav07"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400 px-3 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 shadow-sm"
            >
              <FiGithub size={13} /> GitHub <FiExternalLink size={11} />
            </a>
            <a
              href="https://www.linkedin.com/in/sachinyadav-it/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
            >
              <FiLinkedin size={13} /> LinkedIn
            </a>
          </div>

          {/* Highlights: CGPA & MERN Stack */}
          <div className="grid grid-cols-2 gap-2.5 mb-9">
            <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] p-4">
              <FiAward className="mb-1 text-cyan-400" size={16} />
              <p className="text-base font-bold text-white tracking-tight">
                8.94 / 10
              </p>
              <p className="text-[11px] text-cyan-300/80 font-medium">
                B.E. IT · CGPA
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <FiCode className="mb-1 text-blue-400" size={18} />
              <p className="text-base font-bold text-white tracking-tight">
                MERN
              </p>
              <p className="text-[11px] text-slate-400">Full-Stack Dev</p>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-5 ">
            <p className="text-[18px] font-medium text-slate-300 mb-3">
              Ask directly:
            </p>
            <div className="space-y-4">
              {[
                "Explain his projects",
                "What is his tech stack?",
                "Tell me about his 8.94 CGPA",
              ].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => sendQuestion(null, p)}
                  className="w-full text-left text-[14px] text-slate-400 hover:text-cyan-300 flex items-center justify-between py-1.5 cursor-pointer transition"
                >
                  <span>{p}</span>
                  <span className="text-cyan-400 text-xs">↗</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-3 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          © {new Date().getFullYear()} Sachin Yadav · Powered by Groq
        </div>
      </aside>

      {/* Main Chat Area: Takes remaining width and exact height */}
      <section className="relative z-10 flex h-full flex-1 flex-col overflow-hidden bg-[#07090e]">
        {/* Single Line Fixed Header (Never Wraps or Breaks) */}
        <header className="flex h-13 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#090d16]/90 px-3.5 sm:px-5 backdrop-blur-xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 border border-cyan-400/25 text-cyan-300">
              <LuBot size={17} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.9)]" />
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                Portfolio AI
              </span>
              <span className="shrink-0 rounded bg-cyan-400/10 px-1.5 py-0.5 text-[9px] font-semibold text-cyan-300 border border-cyan-400/20">
                Groq
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* CGPA Pill on Header for Mobile & Tablet */}
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
              <FiAward size={10} /> 8.94 CGPA
            </span>

            {/* Mobile Bio Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileBio(!showMobileBio)}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-slate-300 transition hover:bg-white/[0.06] lg:hidden"
            >
              <FiInfo size={12} />
              <span>Bio</span>
            </button>

            {/* Clear Chat Button */}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                disabled={loading}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1.5 text-slate-400 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-40"
                title="Clear conversation"
              >
                <FiTrash2 size={13} />
              </button>
            )}
          </div>
        </header>

        {/* Conversation History: ONLY this area scrolls internally */}
        <div
          ref={messagesContainerRef}
          className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-contain px-3 py-3 sm:px-6"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(34, 211, 238, 0.2) transparent",
          }}
        >
          {/* Welcome Screen: Compact 2x2 grid, ZERO middle scroller */}
          {messages.length === 0 ? (
            <div className="m-auto flex w-full max-w-sm flex-col items-center text-center py-2">
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-md shadow-cyan-500/[0.05]">
                <LuBot size={20} />
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                How can I help you today?
              </h3>
              <p className="mt-0.5 text-[11px] text-slate-400 max-w-[260px]">
                Ask anything about Sachin's engineering work, skills, and
                background.
              </p>

              {/* 2x2 Grid of Compact Chips */}
              <div className="mt-3.5 grid w-full grid-cols-2 gap-2">
                {SUGGESTIONS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => sendQuestion(null, item.prompt)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#0c101c] p-2 text-left transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.04] active:scale-98"
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="text-[11px] font-medium text-slate-200 truncate">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-2xl space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id ?? `${message.role}-${message.text}`}
                  className={`flex items-start gap-2 sm:gap-2.5 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg text-xs ${
                      message.role === "user"
                        ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                        : "border border-white/10 bg-[#0d1220] text-cyan-300"
                    }`}
                  >
                    {message.role === "user" ? (
                      <FiUser size={11} />
                    ) : (
                      <LuBot size={13} />
                    )}
                  </div>

                  <div
                    className={`min-w-0 max-w-[88%] sm:max-w-[82%] rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 ${
                      message.role === "user"
                        ? "rounded-tr-xs border border-cyan-400/25 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-slate-100 shadow-sm"
                        : "rounded-tl-xs border border-white/[0.08] bg-[#0c101b] text-slate-200 shadow-md"
                    }`}
                  >
                    {/* Header inside assistant message */}
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-cyan-400 mb-1">
                        <span>Portfolio AI</span>
                      </div>
                    )}

                    {/* Thinking Indicator */}
                    {message.role === "assistant" &&
                    !message.text &&
                    loading ? (
                      <div className="flex items-center gap-1.5 py-0.5 text-xs text-slate-400">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />
                        <span className="text-[10px] text-slate-400 font-medium ml-1">
                          Thinking...
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`markdown-content min-w-0 break-words text-xs leading-relaxed ${
                          message.error ? "text-rose-300" : ""
                        }`}
                      >
                        <ReactMarkdown
                          components={{
                            a: ({ ...props }) => (
                              <a
                                {...props}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-cyan-300 underline underline-offset-4 hover:text-cyan-200 break-all"
                              />
                            ),
                            h1: ({ ...props }) => (
                              <h1
                                className="mb-1 mt-2 text-xs sm:text-sm font-bold text-white tracking-tight"
                                {...props}
                              />
                            ),
                            h2: ({ ...props }) => (
                              <h2
                                className="mb-1 mt-1.5 text-xs font-bold text-white tracking-tight"
                                {...props}
                              />
                            ),
                            p: ({ ...props }) => (
                              <p
                                className="mb-1.5 leading-relaxed text-slate-200 last:mb-0"
                                {...props}
                              />
                            ),
                            ul: ({ ...props }) => (
                              <ul
                                className="my-1 list-disc space-y-0.5 pl-3.5 marker:text-cyan-400"
                                {...props}
                              />
                            ),
                            ol: ({ ...props }) => (
                              <ol
                                className="my-1 list-decimal space-y-0.5 pl-3.5 marker:text-cyan-400"
                                {...props}
                              />
                            ),
                            li: ({ ...props }) => (
                              <li
                                className="text-slate-200 leading-relaxed"
                                {...props}
                              />
                            ),
                            strong: ({ ...props }) => (
                              <strong
                                className="font-semibold text-white"
                                {...props}
                              />
                            ),
                            code: ({ inline, ...props }) =>
                              inline ? (
                                <code
                                  className="rounded bg-white/[0.08] px-1 py-0.5 font-mono text-[10px] text-cyan-200 border border-white/[0.06]"
                                  {...props}
                                />
                              ) : (
                                <code
                                  className="block overflow-x-auto font-mono text-[10px] text-cyan-200"
                                  {...props}
                                />
                              ),
                            pre: ({ ...props }) => (
                              <div className="relative my-1.5 overflow-hidden rounded-lg border border-white/10 bg-[#05070c]">
                                <pre
                                  className="overflow-x-auto p-2 text-[10px] font-mono leading-relaxed text-cyan-200"
                                  {...props}
                                />
                              </div>
                            ),
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>

                        {message.role === "assistant" &&
                          loading &&
                          message.text && (
                            <span className="ml-0.5 inline-block h-3 w-1 animate-pulse rounded-full bg-cyan-400 align-middle" />
                          )}
                      </div>
                    )}

                    {/* Copy Button */}
                    {message.role === "assistant" &&
                      message.text &&
                      !loading && (
                        <div className="mt-1.5 flex items-center justify-end border-t border-white/[0.04] pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(message.text, message.id)
                            }
                            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-slate-400 transition hover:bg-white/[0.06] hover:text-cyan-300 cursor-pointer"
                            title="Copy response"
                          >
                            {copiedId === message.id ? (
                              <>
                                <FiCheck
                                  className="text-emerald-400"
                                  size={10}
                                />
                                <span className="text-emerald-400 font-medium">
                                  Copied
                                </span>
                              </>
                            ) : (
                              <>
                                <FiCopy size={10} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Input Composer: STRICTLY PINNED, NEVER CUT OFF */}
        <div className="shrink-0 border-t border-white/[0.08] bg-[#090d16]/95 px-3 py-2 sm:px-5 sm:py-2.5 backdrop-blur-xl">
          <form onSubmit={sendQuestion} className="mx-auto w-full max-w-2xl">
            <div className="flex items-end gap-1.5 rounded-xl border border-white/[0.12] bg-[#05070c] p-1 transition focus-within:border-cyan-400/50 focus-within:ring-1 focus-within:ring-cyan-400/20">
              <textarea
                ref={inputRef}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendQuestion(event);
                  }
                }}
                placeholder="Ask about Sachin's skills, projects, experience..."
                aria-label="Ask a question about Sachin"
                disabled={loading}
                rows={1}
                className="max-h-24 min-h-[36px] flex-1 resize-none overflow-y-auto bg-transparent px-2.5 py-1.5 text-xs text-white outline-none placeholder:text-slate-500 disabled:opacity-60 leading-relaxed"
              />

              <button
                type="submit"
                disabled={loading || !question.trim()}
                aria-label="Send message"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400 text-slate-950 font-bold transition hover:bg-cyan-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-cyan-400 shadow-sm shadow-cyan-400/15 cursor-pointer"
              >
                <FiArrowUp size={16} />
              </button>
            </div>

            {/* Concise Footer */}
            <div className="mt-1 text-center text-[10px] text-slate-500 tracking-tight">
              Sachin Yadav · TCET '27 (CGPA 8.94) · Powered by Groq AI
            </div>
          </form>
        </div>
      </section>

      {/* Mobile Slide-over Drawer for Sachin's Bio */}
      {showMobileBio && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-md rounded-t-2xl border-t border-white/10 bg-[#090d16] p-4 shadow-2xl space-y-3.5 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-500 font-bold text-slate-950 text-xs">
                  SY
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Sachin Yadav</h4>
                  <p className="text-[10px] text-slate-400">
                    Full-Stack Developer
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMobileBio(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/[0.06] hover:text-white"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="inline-flex items-center gap-1 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-2.5 py-0.5 text-[10px] font-medium text-cyan-300">
              <FiZap size={10} />
              INFORMATION TECHNOLOGY · TCET '27
            </div>

            <p className="text-xs leading-relaxed text-slate-300">
              Welcome to my interactive portfolio. Ask the AI assistant
              questions directly to learn about my projects, skills, and
              background.
            </p>

            {/* Highlights: CGPA & MERN Stack */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-cyan-400/25 bg-cyan-400/[0.05] p-2.5">
                <FiAward className="mb-0.5 text-cyan-400" size={14} />
                <p className="text-sm font-bold text-white">8.94 / 10</p>
                <p className="text-[10px] text-cyan-300/80 font-medium">
                  B.E. IT · CGPA
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5">
                <FiCode className="mb-0.5 text-blue-400" size={14} />
                <p className="text-sm font-bold text-white">MERN</p>
                <p className="text-[10px] text-slate-400">Full-Stack Dev</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 pt-1">
              <a
                href="https://github.com/sjyadav07"
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-cyan-400 py-2 text-xs font-semibold text-slate-950"
              >
                <FiGithub size={13} /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/sachinyadav-it/"
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] py-2 text-xs font-medium text-slate-200"
              >
                <FiLinkedin size={13} /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
