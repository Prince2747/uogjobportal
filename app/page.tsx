import Homehero from "./components/hero1";
import Navbar from "./components/Navbar";
import FeaturedSections from "./components/FeaturedSections";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Homehero />
      <FeaturedSections />
      <Footer />
    </div>
  );
}
