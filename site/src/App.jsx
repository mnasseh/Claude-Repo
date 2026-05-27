import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { Hero } from './components/sections/Hero';
import { TrustBand } from './components/sections/TrustBand';
import { Sectors } from './components/sections/Sectors';
import { TechSection } from './components/sections/TechSection';
import { Process } from './components/sections/Process';
import { Cryo } from './components/sections/Cryo';
import { Videos } from './components/sections/Videos';
import { Team } from './components/sections/Team';
import { Testimonials } from './components/sections/Testimonials';
import { Zone } from './components/sections/Zone';
import { Contact } from './components/sections/Contact';

export default function App() {
  return (
    <div className="relative min-h-screen bg-ink-900 text-white">
      <Nav />
      <main>
        <Hero />
        <TrustBand />
        <Sectors />
        <TechSection />
        <Process />
        <Cryo />
        <Videos />
        <Team />
        <Testimonials />
        <Zone />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
