import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Ruler, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  SlidersHorizontal,
  Building,
  CheckCircle2,
  Video
} from 'lucide-react';
import { apiService } from '../utils/api';
import Navbar from '../components/Navbar';
import ThreeCanvas from '../components/ThreeCanvas';
import Project3DModel from '../components/Project3DModel';

// Simple CountUp animation helper for stats (capped at 60 renders for performance safety)
const CountUp: React.FC<{ value: number; duration?: number; suffix?: string }> = ({ value, duration = 1.5, suffix = "" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    
    const totalMiliseconds = duration * 1000;
    const steps = 60; // Max 60 updates to match standard monitor refresh rate
    const stepIncrement = Math.ceil(end / steps);
    const incrementTime = Math.max(16, Math.floor(totalMiliseconds / steps)); // Min 16ms (60fps)
    
    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count}{suffix}</span>;
};

// 3D Card tilt effect hook
const useTilt = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const angleX = (yc - y) / 15; // tilt up to 10 deg
    const angleY = (x - xc) / 15;
    
    el.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
  };
  
  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };
  
  return { ref, handleMouseMove, handleMouseLeave };
};

// Single project card with premium tilt & scale animations
const ProjectCard: React.FC<{ project: any; onClick: () => void }> = ({ project, onClick }) => {
  const tilt = useTilt();
  
  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={tilt.handleMouseMove}
      onMouseLeave={tilt.handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
      className="group relative cursor-pointer glass-panel bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-2xl h-[420px] transition-all duration-300 hover:border-primary/30"
    >
      {/* Dynamic Background Image Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={project.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"} 
          alt={project.name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-2 via-dark/40 to-transparent opacity-85 transition-opacity group-hover:opacity-90" />
      </div>

      {/* Floating Status Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2">
        <span className="bg-primary/95 text-dark-2 text-[8px] font-sans font-bold tracking-[1.5px] uppercase px-3 py-1.5 rounded-full shadow-lg">
          {project.tag || "Completed"}
        </span>
        <span className="bg-black/60 backdrop-blur-md text-white text-[8px] font-sans font-bold tracking-[1.5px] uppercase px-3 py-1.5 rounded-full border border-white/10">
          {project.category || project.type}
        </span>
      </div>

      {/* Content (Sits on top of gradient overlay) */}
      <div className="absolute inset-x-0 bottom-0 p-8 z-10 flex flex-col justify-end h-1/2 text-white">
        
        {/* Project Name Stagger */}
        <h3 className="font-serif-display text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
          {project.name}
        </h3>

        {/* Location & Stats */}
        <div className="flex items-center gap-2 text-xs text-gray-concrete mb-4">
          <MapPin size={12} className="text-primary flex-shrink-0" />
          <span>{project.location}</span>
        </div>

        {/* Dynamic Card Divider Line */}
        <div className="w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-500 ease-out mb-4" />

        {/* Details Stagger Up */}
        <div className="h-0 overflow-hidden opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 ease-out space-y-3">
          <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-sans tracking-[1px] text-white/70">
            <div className="flex items-center gap-1.5">
              <Ruler size={12} className="text-primary" />
              <span>{project.area || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-primary" />
              <span>{project.year || "N/A"}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold text-primary tracking-[1.5px] uppercase pt-2">
            <span>View Project</span>
            <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // All, Residential, Commercial, Villa, Apartment, Ongoing, Completed, Luxury
  const [searchOpen, setSearchOpen] = useState(false);

  // Load Projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProjects();
        if (data && data.length > 0) {
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed fetching projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
    window.scrollTo(0, 0);
  }, []);

  // Filter Categories
  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'villa', label: 'Luxury Villas' },
    { id: 'apartment', label: 'Apartments' },
    { id: 'ongoing', label: 'Ongoing Builds' },
    { id: 'completed', label: 'Completed' },
    { id: 'luxury', label: 'Luxury Class' }
  ];

  // Filtering Logic
  const filteredProjects = useMemo(() => {
    return projects.filter(proj => {
      // 1. Category Filter
      const cat = activeCategory.toLowerCase();
      const projType = (proj.type || '').toLowerCase();
      const projCat = (proj.category || '').toLowerCase();
      const projTag = (proj.tag || '').toLowerCase();
      const projStatus = (proj.status || '').toLowerCase();

      let matchesCategory = true;
      if (cat !== 'all') {
        if (cat === 'residential' || cat === 'commercial') {
          matchesCategory = projType === cat;
        } else if (cat === 'villa' || cat === 'apartment') {
          matchesCategory = projCat === cat;
        } else if (cat === 'ongoing') {
          matchesCategory = projStatus === 'ongoing' || projTag.includes('ongoing');
        } else if (cat === 'completed') {
          matchesCategory = projStatus === 'completed' || projTag.includes('completed') || projTag.includes('flagship');
        } else if (cat === 'luxury') {
          matchesCategory = projTag.includes('luxury') || projTag.includes('premium') || projTag.includes('flagship');
        }
      }

      // 2. Search Query Filter
      let matchesSearch = true;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const name = (proj.name || '').toLowerCase();
        const loc = (proj.location || '').toLowerCase();
        const yr = String(proj.year || '');
        const c = (proj.category || proj.type || '').toLowerCase();
        
        matchesSearch = name.includes(query) || loc.includes(query) || yr.includes(query) || c.includes(query);
      }

      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  // Featured Project (marked featured, or fallback to Sidharth Upscale / Natura / Vimalachal)
  const featuredProject = useMemo(() => {
    const feat = projects.find(p => p.featured === true);
    if (feat) return feat;
    return projects.find(p => p.id === 'upscale') || projects[0];
  }, [projects]);

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary selection:text-dark-2 overflow-x-hidden">
      <Navbar />

      {/* ======================================================== */}
      {/* 1. CINEMATIC FULLSCREEN HERO */}
      {/* ======================================================== */}
      <section className="h-screen w-full relative flex items-center justify-center overflow-hidden">
        {/* Procedural WebGL Stars Background */}
        <div className="absolute inset-0 z-0">
          <ThreeCanvas enableControls={false} cameraPos={[0, 4, 10]}>
            {/* Show an abstract glowing villa skeleton in the background hero */}
            <Project3DModel type="villa" color="#d4a853" wireframe={true} />
          </ThreeCanvas>
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark-2/80 to-dark" />
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 md:px-16 w-full z-10 text-center flex flex-col items-center">
          
          {/* Breadcrumb glass tag */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-panel-dark px-4 py-2 rounded-full border border-white/5 text-[9px] uppercase tracking-[3px] font-sans font-bold text-primary mb-8"
          >
            Home / Portfolio
          </motion.div>

          {/* Staggered Serif Headlines */}
          <h1 className="font-serif-display text-5xl md:text-8xl font-bold leading-tight mb-8">
            <motion.span 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              Crafting Tomorrow's
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="block text-primary italic font-serif"
            >
              Landmarks
            </motion.span>
          </h1>

          {/* Hero Statistics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 md:gap-16 max-w-2xl border-t border-white/10 pt-8 mt-4 w-full text-center"
          >
            <div className="space-y-1">
              <div className="font-serif-display text-2xl md:text-4xl font-bold text-primary">
                <CountUp value={28} suffix="+" />
              </div>
              <div className="text-[9px] uppercase tracking-[1.5px] text-gray-concrete">Completed</div>
            </div>
            <div className="space-y-1">
              <div className="font-serif-display text-2xl md:text-4xl font-bold text-primary">
                <CountUp value={10} suffix="M+" />
              </div>
              <div className="text-[9px] uppercase tracking-[1.5px] text-gray-concrete">Sq.Ft Erected</div>
            </div>
            <div className="space-y-1">
              <div className="font-serif-display text-2xl md:text-4xl font-bold text-primary">
                <CountUp value={100} suffix="%" />
              </div>
              <div className="text-[9px] uppercase tracking-[1.5px] text-gray-concrete">Client Trust</div>
            </div>
          </motion.div>

          {/* Scroll Call to Action */}
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            onClick={() => document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-16 text-[10px] font-sans font-bold tracking-[3px] uppercase text-white/50 hover:text-primary transition-colors flex flex-col items-center gap-2"
          >
            <span>Explore Projects</span>
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-[1px] h-10 bg-gradient-to-b from-primary to-transparent" 
            />
          </motion.button>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. STORYTELLING INTRO SECTION */}
      {/* ======================================================== */}
      <section id="intro" className="py-24 max-w-7xl mx-auto px-6 md:px-16 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase mb-4 block">DESIGN CRITERION</span>
          <h2 className="font-serif-display text-3xl md:text-5xl font-bold leading-tight text-white mb-6">
            A Legacy Written in Reinforced Concrete & Timeless Gold
          </h2>
          <p className="text-sm text-gray-concrete leading-relaxed font-sans font-light">
            Our portfolio represents years of meticulous craftsmanship, architectural innovation, and unwavering client trust. 
            From luxury structural residential estates in Porur to urban residential high-rises in the core of Chennai, 
            each landmark is built with precision, integrating WebGL engineering principles with physical aesthetics.
          </p>
        </motion.div>
        
        {/* Animated luxury divider */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex-shrink-0 flex items-center justify-center w-36 h-36 border border-primary/20 rounded-full relative"
        >
          <div className="absolute w-24 h-24 border border-dashed border-white/10 rounded-full animate-[spin_40s_linear_infinite]" />
          <Sparkles className="text-primary w-8 h-8 animate-pulse" />
        </motion.div>
      </section>

      {/* ======================================================== */}
      {/* 3. FLAGSHIP FEATURED PROJECT BANNER */}
      {/* ======================================================== */}
      {featuredProject && (
        <section className="py-12 px-6 md:px-16 max-w-7xl mx-auto w-full">
          <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase mb-6 block">FEATURED COMMISSION</span>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onClick={() => navigate(`/project/${featuredProject.slug || featuredProject.id}`)}
            className="group cursor-pointer relative w-full h-[600px] rounded-3xl overflow-hidden border border-white/5 shadow-premium-glow/5"
          >
            {/* Background Image / Autoplay Video Overlay */}
            <div className="absolute inset-0">
              <img 
                src={featuredProject.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"} 
                alt={featuredProject.name} 
                className="w-full h-full object-cover transition-transform duration-[8000ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-2 via-dark/30 to-transparent" />
            </div>

            {/* Video symbol watermark overlay */}
            <div className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-primary/95 text-dark-2 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Video size={16} className="animate-pulse" />
            </div>

            {/* Featured Details bottom overlay */}
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-16 z-10 flex flex-col justify-end text-white">
              
              <div className="flex items-center gap-3 text-primary mb-3">
                <CheckCircle2 size={16} />
                <span className="text-[10px] uppercase font-sans tracking-[3px] font-bold">Flagship Completed Masterpiece</span>
              </div>

              <h3 className="font-serif-display text-4xl md:text-6xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                {featuredProject.name}
              </h3>
              
              <p className="text-gray-concrete text-sm max-w-xl mb-8 leading-relaxed font-sans font-light">
                {featuredProject.description}
              </p>

              {/* Stats overlay */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl border-t border-white/10 pt-8 text-[11px] uppercase tracking-[1.5px] font-sans text-white/80">
                <div>
                  <span className="block text-primary text-xs font-bold mb-1">CLIENT</span>
                  {featuredProject.client}
                </div>
                <div>
                  <span className="block text-primary text-xs font-bold mb-1">LOCATION</span>
                  {featuredProject.location}
                </div>
                <div>
                  <span className="block text-primary text-xs font-bold mb-1">AREA SIZE</span>
                  {featuredProject.area}
                </div>
                <div>
                  <span className="block text-primary text-xs font-bold mb-1">COMPLETION</span>
                  {featuredProject.year}
                </div>
              </div>

            </div>
          </motion.div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 4. SEARCH & FILTER INTERACTION PANEL */}
      {/* ======================================================== */}
      <section className="py-16 max-w-7xl mx-auto px-6 md:px-16">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-8 mb-12">
          
          {/* Categories flex list */}
          <div className="flex items-center gap-3 flex-wrap">
            <Filter size={14} className="text-primary mr-2 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-[10px] uppercase tracking-[1px] font-sans font-bold border rounded-full transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-dark-2 border-primary shadow-premium-glow'
                    : 'border-white/10 text-white/70 hover:border-white/40 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Animated Search bar */}
          <div className="relative flex items-center">
            <SlidersHorizontal size={14} className="text-primary mr-3 flex-shrink-0" />
            <div className={`relative flex items-center transition-all duration-500 ${searchOpen || searchQuery ? 'w-64 md:w-80' : 'w-48'}`}>
              <input
                type="text"
                placeholder="Search landmarks, years, categories..."
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-2/60 border border-white/10 rounded-full px-5 py-2.5 text-xs text-white focus:outline-none focus:border-primary pl-10 pr-4 transition-colors"
              />
              <Search size={14} className="absolute left-4 text-white/40" />
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 5. PORTFOLIO MASONRY GRID */}
        {/* ======================================================== */}
        {loading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl h-[420px] animate-pulse relative overflow-hidden" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((proj) => (
                <ProjectCard 
                  key={proj._id || proj.id} 
                  project={proj} 
                  onClick={() => navigate(`/project/${proj.slug || proj.id}`)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          // Empty State
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl max-w-xl mx-auto space-y-4">
            <Building className="mx-auto text-primary w-12 h-12 opacity-40" />
            <h4 className="font-serif-display text-xl font-bold">No Projects Found</h4>
            <p className="text-xs text-gray-concrete max-w-md mx-auto leading-relaxed">
              We couldn't find any structural commissions matching your filters or search tags. Try resetting filters to inspect the full portfolio.
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="bg-primary text-dark-2 font-sans font-bold tracking-[1.5px] text-[10px] uppercase px-5 py-2.5 rounded transition-all hover:bg-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Bottom accent skyline cranes element */}
      <div className="h-20 bg-gradient-to-t from-dark-2 to-dark relative border-t border-white/5 overflow-hidden">
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-primary/20" />
      </div>
    </div>
  );
};

export default Projects;
