import React from 'react';
import Navbar from '../components/Navbar';

const projects = [
  { title: 'TVS Nagar - 2',    src: '/TVS 2 .png' },
  { title: 'TVS Nagar - 1',    src: '/TVS nAGAR 1.png' },
  { title: 'Lake View',         src: '/lake view.png' },
  { title: 'Royal Castle',      src: '/royal castle .png' },
  { title: 'Royal Enclave',     src: '/royal enclave .png' },
  { title: 'Siva Nagar',        src: '/sivanagar .png' },
];

const CompletedProjects: React.FC = () => (
  <div className="relative bg-white text-dark min-h-screen">
    <Navbar />

    <section className="pt-40 pb-32 px-6 md:px-16 max-w-7xl mx-auto">
      <div className="mb-16">
        <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase mb-3 block">
          PORTFOLIO
        </span>
        <h1 className="font-serif-display text-4xl md:text-6xl text-dark font-bold">
          Completed Projects
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj) => (
          <div
            key={proj.title}
            className="group relative rounded-xl overflow-hidden border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-premium-glow hover:border-primary/20"
          >
            <div className="project-card-img relative aspect-[4/3] overflow-hidden">
              <img
                src={proj.src}
                alt={proj.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full px-5 py-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h4 className="font-serif-display text-3xl text-white font-bold">
                    {proj.title}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default CompletedProjects;
