import Homehero from "./hero1";
import Navbar from "./Navbar";
import FeaturedSections from "./FeaturedSections";
import Footer from "./footer";

function Homepage() {
  return (
    <>
      <Navbar />
      <Homehero />
      <FeaturedSections />
      <Footer />
    </>
  );
}
export default Homepage;
