import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, LogOut, Shuffle, MessageCircle } from "lucide-react";

const AVATARS = ["🐱", "🐻", "🐰", "🦊", "🐼", "🐸", "🦉", "🐧"];
const REACTIONS = ["📖", "😴", "💪", "🤔", "✍️", "☕", "🎯", "😊"];
const DURATIONS = [30, 45, 60];

const StudyRoom = () => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [myAvatar, setMyAvatar] = useState("🐱");
  const [partnerAvatar] = useState("🐻");
  const [myReaction, setMyReaction] = useState("📖");
  const [partnerReaction] = useState("✍️");
  const [showReactions, setShowReactions] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  const startSession = useCallback(() => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      setSessionStarted(true);
      setTimeLeft(selectedDuration * 60);
    }, 2500);
  }, [selectedDuration]);

  const endSession = () => {
    setSessionStarted(false);
    setTimeLeft(0);
  };

  useEffect(() => {
    if (!sessionStarted || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [sessionStarted, timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = sessionStarted ? 1 - timeLeft / (selectedDuration * 60) : 0;

  // Matching screen
  if (isMatching) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-6xl"
        >
          ☁️
        </motion.div>
        <p className="text-lg font-semibold text-foreground">Finding your study buddy...</p>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-sky-deep"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Pre-session: pick avatar & duration
  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">☁️</span>
            <span className="text-xl font-bold text-foreground">StudyMate</span>
          </a>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <h1 className="text-2xl font-bold text-foreground text-center mb-8">
              Ready to study? ✨
            </h1>

            {/* Avatar picker */}
            <div className="bg-card rounded-2xl p-6 border border-border cloud-shadow mb-6">
              <p className="text-sm font-semibold text-foreground mb-3">Choose your avatar</p>
              <div className="grid grid-cols-4 gap-3">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setMyAvatar(a)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                      myAvatar === a
                        ? "bg-accent ring-2 ring-primary scale-110"
                        : "bg-secondary hover:bg-accent"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration picker */}
            <div className="bg-card rounded-2xl p-6 border border-border cloud-shadow mb-8">
              <p className="text-sm font-semibold text-foreground mb-3">Session duration</p>
              <div className="flex gap-3">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDuration(d)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                      selectedDuration === d
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startSession}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-opacity cloud-shadow"
            >
              Find Study Partner 🔍
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Active session
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <span className="text-xl">☁️</span>
          <span className="text-lg font-bold text-foreground">StudyMate</span>
        </a>

        {/* Timer */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={endSession}
            className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            title="End Session"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main study space */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-8">
        <div className="flex items-center gap-8 md:gap-20">
          {/* My avatar */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-card border-2 border-border flex items-center justify-center text-5xl md:text-6xl cloud-shadow breathing">
                {myAvatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-sm">
                {myReaction}
              </div>
              {!isMuted && (
                <motion.div
                  className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Mic size={12} className="text-accent-foreground" />
                </motion.div>
              )}
            </div>
            <span className="text-sm font-semibold text-foreground">You</span>
          </motion.div>

          {/* Connection */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-sky-deep"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">studying together</span>
          </div>

          {/* Partner avatar */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-card border-2 border-border flex items-center justify-center text-5xl md:text-6xl cloud-shadow breathing" style={{ animationDelay: "1.5s" }}>
                {partnerAvatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-sm">
                {partnerReaction}
              </div>
            </div>
            <span className="text-sm font-semibold text-foreground">Study Buddy</span>
          </motion.div>
        </div>

        {/* Time remaining large */}
        <div className="text-center">
          <p className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            {formatTime(timeLeft)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">remaining</p>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="px-4 pb-6">
        {/* Reaction picker */}
        <AnimatePresence>
          {showReactions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-center gap-2 mb-4"
            >
              <div className="bg-card rounded-2xl p-3 border border-border cloud-shadow flex gap-2">
                {REACTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setMyReaction(r);
                      setShowReactions(false);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110 ${
                      myReaction === r ? "bg-accent" : "hover:bg-secondary"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="max-w-md mx-auto mb-4 bg-card rounded-2xl p-4 border border-border cloud-shadow"
            >
              <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
                Chat messages will appear here ☁️
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  className="flex-1 px-4 py-2 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Say hi..."
                />
                <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
                  Send
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls bar */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-2xl transition-all ${
              isMuted
                ? "bg-secondary text-secondary-foreground"
                : "bg-primary text-primary-foreground"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button
            onClick={() => {
              setShowReactions(!showReactions);
              setShowChat(false);
            }}
            className={`p-3.5 rounded-2xl transition-all ${
              showReactions ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
            }`}
            title="Reactions"
          >
            <span className="text-lg">😊</span>
          </button>

          <button
            onClick={() => {
              setShowChat(!showChat);
              setShowReactions(false);
            }}
            className={`p-3.5 rounded-2xl transition-all ${
              showChat ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
            }`}
            title="Chat"
          >
            <MessageCircle size={20} />
          </button>

          <button
            onClick={() => {
              endSession();
              setTimeout(startSession, 100);
            }}
            className="p-3.5 rounded-2xl bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
            title="Switch Partner"
          >
            <Shuffle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
