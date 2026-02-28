import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cloudyColors } from "@/lib/theme";
import { useStudyMate } from "@/context/StudyMateContext";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "How it works", href: "#how" },
  { label: "Rooms", href: "#rooms" },
  { label: "Create Avatar", href: "#avatar" },
];

export const Navigation = () => {
  const { user, profile, logout } = useStudyMate();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-md border-b"
      style={{
        background: `rgba(240, 247, 255, 0.85)`,
        borderColor: cloudyColors.border,
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="text-2xl">☁️</span>
        <span className="font-black text-lg" style={{ color: cloudyColors.deep }}>
          Cloudy
        </span>
      </Link>

      {/* Nav Links - Hidden on mobile */}
      <ul className="hidden md:flex gap-8">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-sm font-medium transition-colors duration-200"
              style={{
                color: cloudyColors.textSoft,
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA Buttons - Right side */}
      <div className="flex items-center gap-2">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200"
              style={{
                color: cloudyColors.textSoft,
              }}
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 rounded-full font-semibold text-white text-sm transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer inline-block"
              style={{ background: cloudyColors.deep }}
            >
              Join Free
            </Link>
          </>
        ) : (
          <>
            {profile && (
              <Link
                to="/study"
                className="px-6 py-2 rounded-full font-semibold text-white text-sm transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer inline-block"
                style={{ background: cloudyColors.deep }}
              >
                Start Studying
              </Link>
            )}
            <button
              onClick={() => logout()}
              className="px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200"
              style={{
                color: cloudyColors.textSoft,
              }}
            >
              Log out
            </button>
          </>
        )}
      </div>
    </motion.nav>
  );
};
