import { useStudyMate } from "@/context/StudyMateContext";
import { Navigation } from "@/components/sections/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { RoomTypes } from "@/components/sections/RoomTypes";
import { AvatarPreview } from "@/components/sections/AvatarPreview";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  const { user } = useStudyMate();

  const handleExploreClick = () => {
    const lobbySection = document.querySelector("#lobby");
    if (lobbySection) {
      lobbySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCreateClick = () => {
    const avatarSection = document.querySelector("#avatar");
    if (avatarSection) {
      avatarSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div style={{ paddingTop: "66px" }}>
        <HeroSection onExploreClick={handleExploreClick} onCreateClick={handleCreateClick} />
      </div>

      {/* How It Works Section */}
      <section id="how">
        <HowItWorks />
      </section>

      {/* Room Types Section */}
      <section id="rooms">
        <RoomTypes />
      </section>

      {/* Avatar Creation Section */}
      <section id="avatar">
        <AvatarPreview />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
