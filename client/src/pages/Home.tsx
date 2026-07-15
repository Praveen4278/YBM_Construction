import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Award, 
  Users, 
  Building, 
  ChevronRight, 
  Compass, 
  Shield, 
  Hammer, 
  Layout, 
  Briefcase, 
  Check, 
  Star 
} from 'lucide-react';
import { apiService } from '../utils/api';
import ThreeCanvas from '../components/ThreeCanvas';
import ConstructionTimeline from '../components/ConstructionTimeline';
import CitySkyline from '../components/CitySkyline';
import Magnetic from '../components/Magnetic';
import Navbar from '../components/Navbar';

gsap.registerPlugin(ScrollTrigger);

// Fallback values in case API is offline during load
const defaultProjects = [
  { id: "vimalachal", name: "Sidharth Vimalachal", location: "Vepery", area: "200,000 Sq.Ft", year: 2008, tag: "Flagship", type: "residential", image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=800&fit=crop" },
  { id: "heights", name: "Sidharth Heights", location: "Saligramam", area: "125,000 Sq.Ft", year: 2012, tag: "Completed", type: "residential", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=450&fit=crop" },
  { id: "natura", name: "Sidharth Natura", location: "Medavakkam", area: "130,000 Sq.Ft", year: 2015, tag: "Green Build", type: "residential", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=450&fit=crop" },
  { id: "upscale", name: "Sidharth Upscale", location: "Porur", area: "447,000 Sq.Ft", year: 2018, tag: "Luxury", type: "residential", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=450&fit=crop" },
  { id: "nest", name: "Sidharth Nest", location: "Rajakilpakkam", area: "172,000 Sq.Ft", year: 2021, tag: "Premium", type: "residential", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=450&fit=crop" }
];

const defaultServices = [
  { id: "s1", title: "Architectural Design", description: "Crafting iconic and visually striking modern luxury villas.", icon: "Compass", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80" },
  { id: "s2", title: "Structural Engineering", description: "Executing complex building blueprints into structurally sound frames.", icon: "Shield", image: "/structural-engineering.png" },
  { id: "s3", title: "General Construction", description: "Deploying automated timelines to achieve rapid delivery.", icon: "Hammer", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80" },
  { id: "s4", title: "Interior Architecture", description: "Defining luxury, comfort, and functionality with premium marble.", icon: "Layout", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80" },
  { id: "s5", title: "Project Management", description: "Supervising full-scale end-to-end building operations.", icon: "Briefcase", image: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=800&q=80" }
];

const defaultTestimonials = [
  { author: "Kammani", project: "Sidharth Upscale", text: "Great locality! I am happy with the location—the heart of the city feels connected to many schools, colleges, and hospitals. I am glad that we are a part of the YBM Construction family.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&fit=crop" },
  { author: "Srinivasan", project: "Sidharth Upscale", text: "Happy and proud home-owners! From booking to handover, everything was very easy and hassle-free. The location is close to schools and the connectivity is great.", avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&fit=crop" }
];

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch((err) => console.warn("Video autoplay failed:", err));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/architech.mp4" type="video/mp4" />
      <source src="/architech.mov" type="video/quicktime" />
    </video>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);

  // Dynamic Data States
  const [projects, setProjects] = useState<any[]>(defaultProjects);
  const [services, setServices] = useState<any[]>(defaultServices);
  const [testimonials, setTestimonials] = useState<any[]>(defaultTestimonials);
  const [settings, setSettings] = useState<any>({
    phone: "+91 94440 12345",
    email: "hello@ybmconstruction.com",
    address: "YBM Corporate Office, 12, Harrington Road, Chetpet, Chennai"
  });

  // GSAP Anim Progress States for 3D components
  const [timelineProgress, setTimelineProgress] = useState(0);

  // Form States
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // CMS/Settings Loading
  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const [projs, servs, tests, setts] = await Promise.all([
          apiService.getProjects(),
          apiService.getServices(),
          apiService.getTestimonials(),
          apiService.getSettings()
        ]);
        if (projs && projs.length > 0) setProjects(projs);
        if (servs && servs.length > 0) {
          // Keep local image for Structural Engineering
          const merged = servs.map((s: any) =>
            s.title === 'Structural Engineering' ? { ...s, image: '/structural-engineering.png' } : s
          );
          setServices(merged);
        }
        if (tests && tests.length > 0) setTestimonials(tests);
        if (setts) setSettings(setts);
      } catch (e) {
        console.warn("Failed fetching live CMS data, running fallbacks:", e);
      }
    };
    fetchSiteData();
  }, []);



  // GSAP ScrollTrigger Configurations
  const timelineSectionRef = useRef<HTMLDivElement>(null);
  const statsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;

    // Pinning Timeline Section & Linking Scroll
    const tlTrigger = ScrollTrigger.create({
      trigger: timelineSectionRef.current,
      start: "top top",
      end: "+=150%",
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        setTimelineProgress(self.progress);
      }
    });

    // Stats Section Count-Up animation triggers
    const statsElements = document.querySelectorAll('.stat-count');
    statsElements.forEach(el => {
      const target = Number(el.getAttribute('data-target'));
      gsap.fromTo(el, 
        { textContent: '0' },
        { 
          textContent: target, 
          duration: 2, 
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Animate stats column heights on scroll
    const bars = document.querySelectorAll('.stat-bar');
    bars.forEach(bar => {
      const height = bar.getAttribute('data-height');
      gsap.fromTo(bar,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bar,
            start: "top 85%"
          }
        }
      );
    });

    return () => {
      tlTrigger.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [loading]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.submitInquiry({
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        message: contactForm.message,
        type: 'contact'
      });
      setFormSubmitted(true);
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (err) {
      alert("Submission failed. Please try again.");
    }
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="text-primary" size={24} />;
      case 'Shield': return <Shield className="text-primary" size={24} />;
      case 'Hammer': return <Hammer className="text-primary" size={24} />;
      case 'Layout': return <Layout className="text-primary" size={24} />;
      case 'Briefcase': return <Briefcase className="text-primary" size={24} />;
      default: return <Compass className="text-primary" size={24} />;
    }
  };

  return (
    <div className="relative bg-white text-dark overflow-x-hidden">


      {/* 2. GLASS NAVIGATION BAR */}
      <Navbar />

      {/* 3.Fullscreen HERO SECTION */}
      <section id="hero" className="w-full relative overflow-hidden">
        {/* Video — drives the section height naturally */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-auto block"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Hero Copy overlay */}
        <div className="absolute inset-0 z-20 flex items-end sm:items-center justify-start px-5 md:px-16 pb-16 sm:pb-0">
          <div className="max-w-4xl sm:mt-12">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-primary text-[10px] md:text-[13px] font-sans font-bold tracking-[3px] md:tracking-[6px] uppercase mb-4 block drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
          >
            LUXURY ARCHITECTURE & ENGINEERING &middot; CHENNAI
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="font-serif-display text-3xl sm:text-5xl md:text-8xl text-white font-bold leading-[1.05] tracking-tight mb-6 md:mb-8 drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]"
          >
            We Build <span className="italic text-primary drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">Sculptural</span> Homes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.5 }}
            className="text-white font-sans text-sm md:text-xl max-w-xl leading-relaxed mb-8 md:mb-12 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium hidden sm:block"
          >
            South India's premier design-build agency. We engineer timeless architectural landmarks, integrating luxury aesthetics with structural permanence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="flex flex-wrap gap-3 items-center"
          >
            <Magnetic>
              <a 
                href="#portfolio" 
                className="bg-primary hover:bg-white text-dark-2 text-xs font-bold tracking-[2px] px-6 py-3 md:px-8 md:py-4 rounded uppercase flex items-center gap-2 transition-all duration-300 hover:shadow-premium-glow hover:-translate-y-1"
              >
                Explore Works <ArrowRight size={16} />
              </a>
            </Magnetic>
            <a 
              href="#about" 
              className="border border-white/20 hover:border-white hover:bg-white/5 text-white text-xs font-bold tracking-[2px] px-6 py-3 md:px-8 md:py-4 rounded uppercase transition-colors"
            >
              Our History
            </a>
          </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[9px] tracking-[3px] text-white/30 uppercase">
          <span>Scroll down</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-primary animate-[scrollLine_2s_infinite]" />
          </div>
        </div>
      </section>

      {/* 4. WHO WE ARE & PILLARS SECTION */}
      <section id="about" className="py-16 md:py-32 px-5 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase mb-4 block">WHO WE ARE</span>
            <h2 className="font-serif-display text-3xl md:text-6xl text-dark font-bold leading-[1.1] mb-8">
              Pillars of <span className="italic text-primary">Reliability</span> & Excellence
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-12">
              Founded in 1998, YBM Construction has risen to become South India's trusted developer of premium residential buildings. We consolidate architectural styling, complex engineering audits, and exact project execution timelines under one team.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Transparency", desc: "No hidden charges or material substitutions. We log updates directly." },
                { title: "Seismic Strength", desc: "Engineered structures compliant with strict Zone III earthquake safety." },
                { title: "Punctuality", desc: "Our automated project management ensures exact handover dates." },
                { title: "Luxury Aesthetics", desc: "Every building features oversized glazing, clean borders, and custom marble." }
              ].map((item, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-lg">
                  <h4 className="font-bold text-dark mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Visual offset display grid */}
            <div className="aspect-[4/5] bg-dark rounded-xl overflow-hidden relative shadow-premium-glow">
              <img 
                src="/Royal Castle.jpg" 
                alt="Modern Royal Castle luxury Villa finish" 
                className="w-full h-full object-cover filter brightness-[0.9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-2 via-transparent to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 glass-panel p-6 rounded-lg">
                <h3 className="font-serif-display text-xl text-dark mb-1">Building Trust Since 1998</h3>
                <p className="text-xs text-primary font-bold uppercase tracking-[2px]">15+ Completed Landmarks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW VIDEO SECTION - SAME LAYOUT AS WHO WE ARE */}
      <section id="video" className="py-16 md:py-32 px-5 md:px-16 max-w-7xl mx-auto bg-slate-50/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase mb-4 block">ARCHITECTURAL VISION</span>
            <h2 className="font-serif-display text-3xl md:text-6xl text-dark font-bold leading-[1.1] mb-8">
              Crafting <span className="italic text-primary">Timeless</span> Spaces
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-12">
              Watch our design and construction process in action. From initial blueprints to final finishing touches, every detail is meticulously planned and executed.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Design Excellence", desc: "Architectural drafting and 3D visualization for every project." },
                { title: "Material Precision", desc: "Premium, sustainable materials sourced from trusted suppliers." },
                { title: "Quality Control", desc: "Multi-stage inspections to ensure structural integrity and finish." },
                { title: "Client Collaboration", desc: "We involve you at every step to realize your vision perfectly." }
              ].map((item, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-lg bg-white">
                  <h4 className="font-bold text-dark mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Video panel */}
            <div className="relative w-full h-[280px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-xl">
              <VideoPlayer />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-2/30 via-transparent to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 glass-panel p-6 rounded-lg">
                <h3 className="font-serif-display text-xl text-dark mb-1">Behind the Scenes</h3>
                <p className="text-xs text-primary font-bold uppercase tracking-[2px]">Our Craft in Motion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BUILDING CONSTRUCTION TIMELINE SCROLL-PINNED SECTION */}
      <section ref={timelineSectionRef} id="timeline" className="h-[100vh] w-full bg-dark-2 relative overflow-hidden hidden md:block">
        <div className="w-full h-full flex flex-col lg:flex-row-reverse relative z-10">
          
          {/* Visual canvas represent timeline */}
          <div className="w-full lg:w-3/5 h-1/2 lg:h-full relative">
            <ThreeCanvas cameraPos={[0, 4, 10]} enableControls={false}>
              <ConstructionTimeline progress={timelineProgress} />
            </ThreeCanvas>
          </div>

          {/* Description panels left */}
          <div className="w-full lg:w-2/5 h-1/2 lg:h-full flex items-center px-6 md:px-12 bg-dark/20 backdrop-blur-sm">
            <div className="max-w-md">
              <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase mb-4 block">CONSTRUCTION LOGISTICS</span>
              <h2 className="font-serif-display text-4xl md:text-5xl text-white font-bold leading-tight mb-6">
                Engineered <br />Step-by-Step
              </h2>
              
              <div className="space-y-6 relative pl-6 border-l border-white/10">
                {[
                  { title: "Foundation Excavation", desc: "Grade beams & reinforced concrete foundation blocks rise.", active: timelineProgress < 0.2 },
                  { title: "Steel Frame Extrusion", desc: "Pillars rise, establishing load paths and Zone III columns.", active: timelineProgress >= 0.2 && timelineProgress < 0.4 },
                  { title: "Concrete Slabs & Walls", desc: "Floors slice in, concrete blocks block perimeter enclosures.", active: timelineProgress >= 0.4 && timelineProgress < 0.6 },
                  { title: "Glazing & Window Triggers", desc: "Double-glazed acoustic windows seal facades from drafts.", active: timelineProgress >= 0.6 && timelineProgress < 0.8 },
                  { title: "Landscaping & Ambient Glow", desc: "Trees grow and interior decorative spotlights fade on.", active: timelineProgress >= 0.8 }
                ].map((step, idx) => (
                  <div key={idx} className={`relative transition-all duration-300 ${step.active ? 'opacity-100 translate-x-2' : 'opacity-30'}`}>
                    <div className={`absolute -left-[30px] top-1.5 w-2.5 h-2.5 rounded-full border border-primary ${step.active ? 'bg-primary shadow-premium-glow' : 'bg-dark-2'}`} />
                    <h4 className="font-bold text-white mb-1">{step.title}</h4>
                    <p className="text-xs text-gray">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EXPANDING HORIZONTAL SERVICES */}
      <section id="services" className="py-16 md:py-32 px-5 md:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase mb-3 block">SERVICES</span>
          <h2 className="font-serif-display text-3xl md:text-6xl text-dark font-bold">What We Deliver</h2>
        </div>

        {/* Expanding Accordion Horizontal flex container */}
        <div className="flex flex-col lg:flex-row w-full gap-4 lg:h-[500px]">
          {services.map((serv, index) => (
            <div 
              key={serv.id}
              className="group relative flex-1 lg:hover:flex-[2.5] bg-white rounded-xl overflow-hidden transition-all duration-700 ease-out border border-slate-100 shadow-sm cursor-pointer h-48 lg:h-auto"
            >
              {/* Background cover image */}
              <img
                src={serv.image}
                alt={serv.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 scale-105 group-hover:scale-100 brightness-75 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />

              {/* Dynamic Information overlays */}
              <div className="absolute inset-x-6 bottom-6 flex flex-col justify-end h-3/4 z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-50/70 border border-amber-100/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {getServiceIcon(serv.icon)}
                  </div>
                  <h3 className="font-serif-display text-xl md:text-2xl text-dark font-bold">{serv.title}</h3>
                </div>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed max-h-0 opacity-0 overflow-hidden group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                  {serv.description}
                </p>
              </div>

              {/* Gold active borders */}
              <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 rounded-xl transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </section>

      {/* 8. COMPLETED PROJECTS PORTFOLIO */}
      <section id="portfolio" className="py-16 md:py-32 bg-slate-50/50 px-5 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase mb-3 block">PORTFOLIO</span>
            <h2 className="font-serif-display text-3xl md:text-6xl text-dark font-bold">Featured Projects</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "TVS Nagar - 2",    src: "/TVS 2 .png" },
              { title: "TVS Nagar - 1",    src: "/TVS nAGAR 1.png" },
              { title: "Lake View",         src: "/lake view.png" },
              { title: "Royal Castle",      src: "/royal castle .png" },
              { title: "Royal Enclave",     src: "/royal enclave .png" },
              { title: "Siva Nagar",        src: "/sivanagar .png" },
            ].map((proj) => (
              <div key={proj.title} className="group relative rounded-xl overflow-hidden border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-premium-glow hover:border-primary/20">
                <div className="project-card-img relative aspect-[4/3] overflow-hidden">
                  <img
                    src={proj.src}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Title overlay — visible only on hover */}
                  <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-full px-5 py-4 bg-gradient-to-t from-black/70 to-transparent">
                      <h4 className="font-serif-display text-3xl text-white font-bold">{proj.title}</h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. STATISTICS & OVERVIEW SECTION */}
      <section ref={statsSectionRef} className="py-16 md:py-32 px-5 md:px-16 bg-white relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left panel describing facts */}
          <div>
            <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase mb-4 block">STATISTICS</span>
            <h2 className="font-serif-display text-3xl md:text-6xl text-dark font-bold mb-8">
              Numbers that <br />Define <span className="italic text-primary">Reliability</span>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Every numeric coordinate highlights a physical milestone built with structural integrity, quality compliance, and total transparency.
            </p>
            <div className="grid grid-cols-2 gap-8">
              {[
                { count: "15", label: "Completed Projects", sym: "+" },
                { count: "15", label: "Years Experience", sym: "+" },
                { count: "250", label: "Happy Homeowners", sym: "+" },
                { count: "2", label: "Million Sq.Ft Constructed", sym: "M+" }
              ].map((stat, i) => (
                <div key={i} className="border-l-2 border-primary/20 pl-4">
                  <div className="text-3xl md:text-4xl font-sans font-bold text-dark mb-1">
                    <span className="stat-count" data-target={stat.count}>{stat.count}</span>
                    <span className="text-primary">{stat.sym}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-[1px]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel visual rising columns representing concrete growth */}
          <div className="flex justify-around items-end h-[220px] md:h-[350px] bg-slate-50 p-4 md:p-8 rounded-xl border border-slate-100 shadow-sm">
            {[
              { height: "25%", label: "1998", val: "10" },
              { height: "45%", label: "2005", val: "22" },
              { height: "65%", label: "2012", val: "38" },
              { height: "80%", label: "2018", val: "44" },
              { height: "100%", label: "2026", val: "68" }
            ].map((col, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4 w-12">
                <span className="text-[10px] text-primary font-bold">{col.val}</span>
                <div 
                  className="stat-bar w-8 bg-gradient-to-t from-primary/20 to-primary rounded-t-sm origin-bottom" 
                  data-height={col.height}
                  style={{ height: col.height }}
                />
                <span className="text-[10px] text-slate-500 uppercase tracking-[1px]">{col.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-16 md:py-32 bg-slate-50/50 px-5 md:px-16 relative">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase mb-4 block">TESTIMONIALS</span>
          <h2 className="font-serif-display text-3xl md:text-5xl text-dark font-bold mb-12">Client Stories</h2>

          <div className="relative bg-white p-6 md:p-16 rounded-2xl border border-slate-100 shadow-sm">
            {/* Displaying simple test sliders */}
            <div className="flex flex-col items-center text-center">
              <div className="flex gap-1 mb-6 text-primary">
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-800 font-sans text-base md:text-lg italic leading-relaxed mb-8">
                "{testimonials[0]?.text}"
              </p>
              <div className="flex items-center gap-4 text-left">
                <img 
                  src={testimonials[0]?.avatar} 
                  alt={testimonials[0]?.author} 
                  className="w-12 h-12 rounded-full object-cover border border-primary/20" 
                />
                <div>
                  <h4 className="font-bold text-dark text-sm">{testimonials[0]?.author}</h4>
                  <span className="text-[10px] text-primary tracking-[1px] uppercase">{testimonials[0]?.project}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. CONTACT SECTION & STYLIZED MAP */}
      <section id="contact" className="py-16 md:py-32 bg-white px-5 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Details & Stylized Map representation */}
          <div>
            <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase mb-4 block">INQUIRIES</span>
            <h2 className="font-serif-display text-3xl md:text-6xl text-dark font-bold mb-8">Let's Build</h2>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Visit our headquarters to inspect structural blueprints, wood catalog finishes, and virtual 3D walkthrough models.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex gap-4 items-start">
                <MapPin className="text-primary mt-1" size={20} />
                <div>
                  <h4 className="text-dark font-bold text-sm mb-1">Corporate Headquarters</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{settings.address}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Phone className="text-primary mt-1" size={20} />
                <div>
                  <h4 className="text-dark font-bold text-sm mb-1">Call Representative</h4>
                  <p className="text-xs text-slate-500">{settings.phone}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Mail className="text-primary mt-1" size={20} />
                <div>
                  <h4 className="text-dark font-bold text-sm mb-1">Email Details</h4>
                  <p className="text-xs text-slate-500">{settings.email}</p>
                </div>
              </div>
            </div>

            {/* Premium Vector/Stylized Grid representation of Chennai Map */}
            <div className="h-64 rounded-xl overflow-hidden relative border border-white/5 bg-dark-2 blueprint-grid-blue flex items-center justify-center text-center p-4">
              <div className="absolute inset-0 bg-dark-2/40 z-10" />
              <div className="relative z-20">
                <div className="w-4 h-4 rounded-full bg-primary animate-ping mx-auto mb-2" />
                <div className="w-3.5 h-3.5 rounded-full bg-primary border-2 border-white mx-auto mb-2" />
                <span className="text-[10px] font-sans font-bold tracking-[2px] uppercase text-white/90 block">YBM Chetpet Office</span>
                <span className="text-[9px] text-white/40 block mt-1">12, Harrington Road, Chennai</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-slate-50/60 border border-slate-100 p-6 md:p-12 rounded-2xl shadow-sm">
            <h3 className="font-serif-display text-2xl md:text-3xl text-dark font-bold mb-6">Send Message</h3>
            
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-sans font-bold tracking-[2px] uppercase text-slate-600 mb-2 block">Your Name</label>
                <input 
                  type="text" 
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                  className="w-full bg-white border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" 
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="text-[10px] font-sans font-bold tracking-[2px] uppercase text-slate-600 mb-2 block">Email Address</label>
                <input 
                  type="email" 
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                  className="w-full bg-white border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" 
                  placeholder="name@domain.com"
                />
              </div>
              <div>
                <label className="text-[10px] font-sans font-bold tracking-[2px] uppercase text-slate-600 mb-2 block">Phone Number</label>
                <input 
                  type="tel" 
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" 
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="text-[10px] font-sans font-bold tracking-[2px] uppercase text-slate-600 mb-2 block">Project Summary / Message</label>
                <textarea 
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors resize-none" 
                  placeholder="Tell us about your land area, timeline, and requirements..."
                />
              </div>

              <Magnetic>
                <button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-dark-2 text-dark-2 hover:text-white text-[10px] font-sans font-bold tracking-[2px] py-4 rounded uppercase transition-colors"
                >
                  Submit Form
                </button>
              </Magnetic>

              {formSubmitted && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-xs rounded text-center animate-fade-in">
                  ✓ Message logged successfully. Our team will contact you shortly.
                </div>
              )}
            </form>
          </div>

        </div>
      </section>

      {/* 13. FOOTER SECTION & ANIMATED 3D SKYLINE */}
      <footer className="w-full relative bg-dark-2 overflow-hidden border-t border-white/5 py-12">
        {/* WebGL Footer Background Canvas */}
        <div className="absolute inset-0 z-0 opacity-40">
          <ThreeCanvas cameraPos={[0, 2, 8]} enableControls={false}>
            <CitySkyline />
          </ThreeCanvas>
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-16 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-16 md:mt-40">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/Logo.png" alt="Logo" className="h-6 w-auto filter brightness-0 invert" />
              <span className="font-serif-display text-lg tracking-[2px] text-white font-bold">YBM CONSTRUCTION</span>
            </div>
            <p className="text-gray text-xs leading-relaxed max-w-sm">
              South India's reliable real estate and civil engineering builder. Transforming architectural luxury plans into structural realities since 1998.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-sans font-bold tracking-[2px] uppercase text-white mb-6">Navigation</h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray">
              <a href="#about" className="hover:text-primary transition-colors">Who We Are</a>
              <a href="#blueprint" className="hover:text-primary transition-colors">Blueprint</a>
              <a href="#services" className="hover:text-primary transition-colors">Services</a>
              <a href="#portfolio" className="hover:text-primary transition-colors">Works</a>
              <a href="#testimonials" className="hover:text-primary transition-colors">Reviews</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-sans font-bold tracking-[2px] uppercase text-white mb-6">Headquarters</h4>
            <p className="text-xs text-gray leading-relaxed mb-2">
              12, Harrington Road, Chetpet, Chennai - 600031
            </p>
            <p className="text-xs text-primary font-bold">{settings.phone}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-16 relative z-10 border-t border-white/5 mt-10 md:mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray gap-4">
          <p>&copy; {new Date().getFullYear()} YBM Construction. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/admin/login" className="hover:text-primary transition-colors">CMS Console</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
