import "../components/styles/style.css";

import Breaker from "../components/layout/Breaker";
import Navbar from "../components/specific/landing/Navbar";
import Hero from "../components/specific/landing/Hero";
import Review from "../components/specific/landing/Review";
import Support from "../components/specific/landing/Support";
import Footer from "../components/specific/landing/Footer";
import Feature from "../components/specific/landing/Feature";

const Landing = () => {
  return (
    <>
      <div className="landing-container container">
        <Navbar />
        <Hero />
        <Breaker value="2rem" />
        <Feature />
        <Breaker />
        <Review />
        <Breaker />
      </div>
      <Footer />
    </>
  );
};

export default Landing;
