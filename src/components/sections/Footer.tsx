import { cloudyColors } from "@/lib/theme";

export const Footer = () => {
  return (
    <footer
      className="py-16 text-center"
      style={{ background: cloudyColors.deep, color: "white" }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">☁️</span>
          <span className="text-xl font-black">Cloudy</span>
        </div>

        {/* Description */}
        <p className="text-sm opacity-50">
          Helping college students find space to work and study together.
        </p>

        {/* Tagline */}
        <p className="text-xs mt-2 opacity-40">
          Low pressure · Flexible · Student-safe
        </p>
      </div>
    </footer>
  );
};
