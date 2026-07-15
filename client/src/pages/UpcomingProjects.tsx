import React from 'react';
import Navbar from '../components/Navbar';

const UpcomingProjects: React.FC = () => (
  <div className="relative bg-white text-dark min-h-screen">
    <Navbar />

    <section className="pt-40 pb-32 px-6 md:px-16 max-w-7xl mx-auto">
      <div className="mb-16">
        <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase mb-3 block">
          COMING SOON
        </span>
        <h1 className="font-serif-display text-4xl md:text-6xl text-dark font-bold">
          Upcoming Projects
        </h1>
        <p className="text-slate-600 text-base md:text-lg leading-relaxed mt-6 max-w-2xl">
          Our next landmark is taking shape. Stay tuned for an architectural experience that redefines luxury living in South India.
        </p>
      </div>

      <div className="flex flex-col gap-8 max-w-2xl mx-auto">
        {[
          { src: '/upcoming.png' },
          { src: '/Image2.png.jpeg' },
          { src: '/image3.jpeg' },
        ].map((proj, i) => (
          <div key={i} className="group relative rounded-xl overflow-hidden border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-premium-glow hover:border-primary/20">
            <div className="project-card-img relative aspect-[4/3] overflow-hidden">
              <img
                src={proj.src}
                alt="Jasmine Nagar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full px-5 py-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h4 className="font-serif-display text-3xl text-white font-bold">Jasmine Nagar</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default UpcomingProjects;
