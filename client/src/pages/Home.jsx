// client/src/pages/Home.jsx
import Footer from '../components/Footer.jsx';
import { HeroSection } from '../components/hero.jsx';
import Hero from '../components/mainhero.jsx';
import ProductnFilter from '../components/productsandfilters.jsx';

export default function Home() {

  return (
    <>
      <HeroSection/>
      <Hero/>
      <ProductnFilter/>
      <Footer />
    </>
  );
}