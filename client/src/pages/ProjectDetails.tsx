import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Ruler, 
  Calendar, 
  Briefcase, 
  Download, 
  Check, 
  Sparkles,
  Info,
  Map,
  Clock,
  User,
  Heart,
  ChevronRight,
  Phone,
  Mail,
  Send,
  X,
  Maximize2
} from 'lucide-react';
import { apiService } from '../utils/api';
import Navbar from '../components/Navbar';
import ThreeCanvas from '../components/ThreeCanvas';
import Project3DModel from '../components/Project3DModel';

export const ProjectDetails: React.FC = () => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const identifier = slug || id;
  const navigate = useNavigate();
  
  const [project, setProject] = useState<any>(null);
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState('living');
  
  // Lightbox State
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // 3D Control States for details visualizer
  const [modelWireframe, setModelWireframe] = useState(false);
  const [modelColor, setModelColor] = useState('#d4a853'); // default gold

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: ''
  });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchProjectAndRelated = async () => {
      try {
        setLoading(true);
        if (identifier) {
          const data = await apiService.getProject(identifier);
          if (data) {
            setProject(data);
            if (data.modelConfig) {
              setModelColor(data.modelConfig.color || '#d4a853');
              setModelWireframe(data.modelConfig.wireframe || false);
            }

            // Fetch all projects to find related ones in the same category
            const allProjects = await apiService.getProjects();
            if (allProjects && allProjects.length > 0) {
              const related = allProjects
                .filter((p: any) => (p.type === data.type || p.category === data.category) && p.id !== data.id)
                .slice(0, 3);
              setRelatedProjects(related);
            }
          }
        }
      } catch (err) {
        console.error("Failed fetching project details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndRelated();
    window.scrollTo(0, 0);
  }, [identifier]);

  // Handle visit booking form submit
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.date) {
      alert("Name, Email, and Preferred Date are required fields.");
      return;
    }

    try {
      setBookingStatus('submitting');
      await apiService.submitInquiry({
        name: bookingForm.name,
        email: bookingForm.email,
        phone: bookingForm.phone,
        subject: `Site Visit request for ${project.name}`,
        message: bookingForm.message,
        type: 'visit',
        details: {
          projectSlug: project.slug || project.id,
          projectName: project.name,
          preferredDate: bookingForm.date
        }
      });
      setBookingStatus('success');
      setBookingForm({ name: '', email: '', phone: '', date: '', message: '' });
      setTimeout(() => setBookingStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setBookingStatus('error');
    }
  };

  // Mock Floor plan configuration sizes and descriptions
  const roomDetails: Record<string, any> = {
    living: {
      size: "24'0\" x 16'6\"",
      flooring: "Imported Greek Marble flooring with mirror polish",
      windows: "Soundproof double-glazed sliding balcony doors",
      amenities: ["Recessed Ambient Ceiling lighting", "Centralized Smart Aircon vents", "Italian wall stucco finish"]
    },
    master: {
      size: "18'0\" x 14'0\"",
      flooring: "Natural teakwood strip flooring with matte sealer",
      windows: "Corner panoramic windows with thermal break profile",
      amenities: ["Walk-in luxury dressing panel wardrobe", "Attached bath with marble vanity", "Smart auto-dimmer triggers"]
    },
    kitchen: {
      size: "14'0\" x 10'0\"",
      flooring: "Anti-skid premium porcelain tile floor finishes",
      windows: "High transom utility venting windows",
      amenities: ["Granite counter with dual stainless sinks", "Integrated chimney venting ducts", "Gas pipe pressure leak triggers"]
    },
    balcony: {
      size: "16'6\" x 6'0\"",
      flooring: "Vitreified wooden planks deck tiling pattern",
      windows: "Toughened structural glass security railing panel",
      amenities: ["Wall-mounted ambient deck lamps", "Anti-splash floor drainage points", "Water sprinkler outlets"]
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col justify-center items-center gap-4">
        <Navbar />
        <div className="w-12 h-12 border-t-2 border-primary border-r-2 border-white/10 rounded-full animate-spin" />
        <span className="text-[10px] uppercase font-sans tracking-[3px] text-white/50 animate-pulse">Loading Blueprint Detail...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark flex flex-col justify-center items-center gap-6">
        <Navbar />
        <h2 className="font-serif-display text-2xl font-bold">Project Blueprint Not Found</h2>
        <button onClick={() => navigate('/projects')} className="bg-primary text-dark-2 text-[10px] font-sans font-bold tracking-[1.5px] uppercase px-6 py-3 rounded hover:bg-white transition-all">
          Return to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary selection:text-dark-2 overflow-x-hidden">
      <Navbar />

      {/* ======================================================== */}
      {/* 1. COVER HERO SECTION */}
      {/* ======================================================== */}
      <section className="min-h-[85vh] w-full relative flex items-end py-20 px-6 md:px-16 overflow-hidden">
        {/* Parallax Image Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={project.image || "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1600&q=80"} 
            alt={project.name} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
        </div>

        {/* Hero Details Text */}
        <div className="max-w-7xl mx-auto w-full z-10 space-y-6">
          <button 
            onClick={() => navigate('/projects')} 
            className="flex items-center gap-2 text-[10px] font-sans font-bold tracking-[2px] uppercase text-primary hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={14} /> Back to Portfolio
          </button>
          
          <div className="space-y-2">
            <span className="bg-primary/90 text-dark-2 text-[8px] font-sans font-bold tracking-[2px] uppercase px-4 py-2 rounded-full shadow-lg inline-block">
              {project.tag || "Completed"}
            </span>
            <h1 className="font-serif-display text-4xl md:text-7xl font-bold leading-tight max-w-4xl text-white">
              {project.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-concrete">
            <MapPin size={14} className="text-primary" />
            <span>{project.location}</span>
          </div>

          {/* Quick specs grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl border-t border-white/10 pt-8 mt-4 text-[10px] uppercase font-sans tracking-[1.5px] text-white/80">
            <div>
              <span className="block text-primary text-[8px] font-bold mb-1">CLIENT COMMISSION</span>
              {project.client || "Sidharth Housing"}
            </div>
            <div>
              <span className="block text-primary text-[8px] font-bold mb-1">BUILT-UP AREA</span>
              {project.area || "200,000 Sq.Ft"}
            </div>
            <div>
              <span className="block text-primary text-[8px] font-bold mb-1">COMPLETION YEAR</span>
              {project.year || "2008"}
            </div>
            <div>
              <span className="block text-primary text-[8px] font-bold mb-1">CATEGORY CLASS</span>
              {project.category || project.type || "Apartment"}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. THE ARCHITECTURAL NARRATIVE */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/5">
        <div className="lg:col-span-8 space-y-6">
          <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase block">THE DESIGN CONCEPT</span>
          <h2 className="font-serif-display text-3xl md:text-5xl font-bold leading-tight">
            Redefining Luxury & Physical Spatial Harmony
          </h2>
          <p className="text-sm text-gray-concrete leading-relaxed font-sans font-light">
            {project.description || "A luxury architectural landmark configured with precise layout details, premium interior finishes, and advanced structural engineering frameworks."}
          </p>
          
          <div className="border-t border-white/5 pt-8 mt-6">
            <h4 className="font-serif-display text-lg font-bold mb-4">Core Specifications Outline</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-concrete">
              <div className="space-y-1">
                <span className="block font-bold text-white uppercase tracking-[1px] text-[10px]">Reinforced Concrete structure</span>
                <span>{project.specs?.structure || "Seismic Zone III compliant RCC framed building."}</span>
              </div>
              <div className="space-y-1">
                <span className="block font-bold text-white uppercase tracking-[1px] text-[10px]">Flooring Accents</span>
                <span>{project.specs?.flooring || "Premium Greek vitrified tiles and teakwood master bedroom setups."}</span>
              </div>
              <div className="space-y-1">
                <span className="block font-bold text-white uppercase tracking-[1px] text-[10px]">Kitchen Utility</span>
                <span>{project.specs?.kitchen || "Granite countertops with modular drawers and chimney provison."}</span>
              </div>
              <div className="space-y-1">
                <span className="block font-bold text-white uppercase tracking-[1px] text-[10px]">Timber Framings & Doors</span>
                <span>{project.specs?.doors || "Solid teakwood frames and multi-layered security locking boards."}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3D BUILDING MODEL CANVAS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel-dark bg-white/[0.02] border border-white/10 p-6 rounded-2xl relative overflow-hidden">
            <h4 className="text-[10px] font-sans font-bold tracking-[2.5px] uppercase text-primary mb-4 flex items-center gap-1.5">
              <Info size={12} /> 3D Virtual Canvas
            </h4>
            
            {/* Visual 3D frame box */}
            <div className="h-64 bg-dark-2 rounded-xl overflow-hidden border border-white/5 relative mb-6">
              <ThreeCanvas cameraPos={[0, 4, 8]} enableControls={true}>
                <Project3DModel 
                  type={project.modelConfig?.type || 'villa'} 
                  color={modelColor}
                  wireframe={modelWireframe}
                />
              </ThreeCanvas>
            </div>

            {/* Visual configuration toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] font-sans">
                <span className="text-gray-concrete uppercase tracking-[1px]">Rendering Mode</span>
                <button 
                  onClick={() => setModelWireframe(!modelWireframe)}
                  className={`px-3 py-1.5 rounded text-[8px] font-sans font-bold tracking-[1.5px] uppercase border transition-colors ${
                    modelWireframe ? 'bg-primary text-dark-2 border-primary shadow-premium-glow' : 'border-white/10 text-white hover:border-white'
                  }`}
                >
                  {modelWireframe ? "Blueprint" : "Realistic"}
                </button>
              </div>

              {/* Specs controls cards */}
              <div className="bg-dark-2/40 p-4 rounded-lg text-[10px] space-y-2 text-gray-concrete font-sans">
                <p>✓ Hover to inspect vector edge divisions</p>
                <p>✓ Drag with mouse to orbit rotate building</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. SCROLL STORYTELLING TIMELINE */}
      {/* ======================================================== */}
      {project.timeline && project.timeline.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-16 border-t border-white/5">
          <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase block mb-4">MILESTONE TRACKER</span>
          <h2 className="font-serif-display text-3xl md:text-5xl font-bold mb-12">Building Construction Journey</h2>
          
          <div className="relative border-l border-white/10 pl-6 md:pl-12 ml-4 space-y-12">
            {project.timeline.map((step: any, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Glowing Dot indicator */}
                <div className="absolute -left-[31px] md:-left-[55px] top-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center shadow-premium-glow">
                  <div className="w-1.5 h-1.5 bg-dark-2 rounded-full" />
                </div>
                
                <div className="glass-panel-dark bg-white/[0.01] border border-white/5 p-6 rounded-2xl max-w-3xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <h4 className="font-serif-display text-lg font-bold text-white">{step.title}</h4>
                    <span className="text-[10px] font-sans text-primary tracking-[1px] uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {step.date || "Completed"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-concrete font-light font-sans">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 4. FLOOR PLANS LAYOUT SECTION */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-16 border-t border-white/5">
        <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase block mb-4">SPATIAL BLUEPRINT</span>
        <h2 className="font-serif-display text-3xl md:text-5xl font-bold mb-12">Interactive Floor Plans</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Switcher Buttons Left */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {Object.keys(roomDetails).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRoom(r)}
                className={`text-left p-5 rounded-xl border text-xs font-sans font-bold tracking-[1.5px] uppercase transition-all flex items-center justify-between ${
                  selectedRoom === r
                    ? 'bg-primary text-dark-2 border-primary shadow-premium-glow'
                    : 'bg-white/[0.02] border-white/5 text-white hover:border-white/20'
                }`}
              >
                <span>{r} plan</span>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>

          {/* Details specs card right */}
          <div className="lg:col-span-8 glass-panel-dark bg-white/[0.01] border border-white/5 p-8 rounded-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                <span className="text-[10px] text-gray-concrete uppercase tracking-[2px] font-sans">Room Dimensions</span>
                <span className="font-serif-display text-2xl font-bold text-primary">{roomDetails[selectedRoom]?.size}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                <span className="text-[10px] text-gray-concrete uppercase tracking-[2px] font-sans">Flooring Accents</span>
                <span className="text-xs text-white/90">{roomDetails[selectedRoom]?.flooring}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                <span className="text-[10px] text-gray-concrete uppercase tracking-[2px] font-sans">Window Glazing</span>
                <span className="text-xs text-white/90">{roomDetails[selectedRoom]?.windows}</span>
              </div>
              
              <div className="pt-4">
                <span className="text-[10px] text-gray-concrete uppercase tracking-[2px] font-sans mb-3 block">Premium Inclusions</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {roomDetails[selectedRoom]?.amenities.map((a: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-white/80 font-sans font-light">
                      <Check size={14} className="text-primary flex-shrink-0" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Brochures */}
            <div className="pt-8 border-t border-white/10 mt-8 flex flex-col sm:flex-row gap-4">
              <a 
                href={project.brochureUrl || '/Brouchere - Lake View.pdf'} 
                download
                className="bg-primary hover:bg-white text-dark-2 text-[10px] font-sans font-bold tracking-[2px] py-4 px-8 rounded uppercase flex items-center justify-center gap-2 transition-colors hover:shadow-premium-glow w-full sm:w-auto"
              >
                <Download size={14} /> Download Brochure PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. MASONRY LIGHTBOX GALLERY */}
      {/* ======================================================== */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-16 border-t border-white/5">
          <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase block mb-4">PERSPECTIVE GALLERY</span>
          <h2 className="font-serif-display text-3xl md:text-5xl font-bold mb-12">Building Perspectives</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.gallery.map((img: string, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                onClick={() => setLightboxImage(img)}
                className="group relative cursor-pointer rounded-2xl overflow-hidden aspect-[4/3] border border-white/5 shadow-2xl"
              >
                <img src={img} alt={`Gallery perspective ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-dark-2 flex items-center justify-center shadow-lg">
                    <Maximize2 size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Fullscreen Lightbox Overlay */}
          <AnimatePresence>
            {lightboxImage && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
              >
                <button 
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <X size={24} />
                </button>
                <motion.img 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  src={lightboxImage} 
                  alt="Lightbox view" 
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* ======================================================== */}
      {/* 6. PROJECT SPECIFIC TESTIMONIALS */}
      {/* ======================================================== */}
      {project.testimonials && project.testimonials.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-16 border-t border-white/5">
          <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase block mb-4">CLIENT REVIEWS</span>
          <h2 className="font-serif-display text-3xl md:text-5xl font-bold mb-12">Resident Experiences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.testimonials.map((test: any, i: number) => (
              <div key={i} className="glass-panel-dark bg-white/[0.01] border border-white/5 p-8 rounded-2xl space-y-6">
                <p className="text-sm text-gray-concrete italic leading-relaxed font-sans font-light">
                  "{test.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {test.author[0]}
                  </div>
                  <div>
                    <h5 className="font-serif-display font-bold text-white text-sm">{test.author}</h5>
                    <span className="text-[10px] uppercase font-sans tracking-[1px] text-primary">{test.project || project.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 7. BOOK SITE VISIT & LANDMARKS */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-16 border-t border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Book Visit Glass Form */}
        <div className="lg:col-span-7 glass-panel-dark bg-white/[0.01] border border-white/5 p-8 rounded-3xl space-y-6">
          <div>
            <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase block mb-2">INQUIRY DESK</span>
            <h3 className="font-serif-display text-2xl md:text-4xl font-bold text-white">Book Private Site Visit</h3>
            <p className="text-xs text-gray-concrete font-sans font-light mt-2">
              Log an appointment scheduling request to coordinate a structural briefing with our site managers.
            </p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Full Name *" 
                required
                value={bookingForm.name}
                onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                className="bg-dark-2/65 border border-white/10 rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-primary"
              />
              <input 
                type="email" 
                placeholder="Email Address *" 
                required
                value={bookingForm.email}
                onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                className="bg-dark-2/65 border border-white/10 rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={bookingForm.phone}
                onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                className="bg-dark-2/65 border border-white/10 rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-primary"
              />
              <input 
                type="date" 
                required
                value={bookingForm.date}
                onChange={e => setBookingForm({...bookingForm, date: e.target.value})}
                className="bg-dark-2/65 border border-white/10 rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
            <textarea 
              rows={4} 
              placeholder="Your Message..." 
              value={bookingForm.message}
              onChange={e => setBookingForm({...bookingForm, message: e.target.value})}
              className="w-full bg-dark-2/65 border border-white/10 rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-primary resize-none"
            />
            
            {bookingStatus === 'success' ? (
              <div className="text-xs text-primary bg-primary/10 border border-primary/30 p-4 rounded text-center">
                ✓ Site visit booking inquiry logged successfully! Our team will contact you shortly.
              </div>
            ) : bookingStatus === 'error' ? (
              <div className="text-xs text-red-400 bg-red-400/10 border border-red-500/20 p-4 rounded text-center">
                ❌ Failed logging visit inquiry. Please try again or contact hello@ybmconstruction.com.
              </div>
            ) : (
              <button 
                type="submit" 
                disabled={bookingStatus === 'submitting'}
                className="w-full bg-primary hover:bg-white text-dark-2 text-[10px] font-sans font-bold tracking-[2px] py-4 rounded uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Send size={12} /> {bookingStatus === 'submitting' ? 'Submitting...' : 'Request Appointment'}
              </button>
            )}
          </form>
        </div>

        {/* Nearby Landmarks list & static map representation */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel-dark bg-white/[0.01] border border-white/5 p-8 rounded-3xl space-y-6">
            <h4 className="text-[10px] font-sans font-bold tracking-[3px] uppercase text-primary flex items-center gap-1.5">
              <Map size={14} /> LANDMARKS MAP
            </h4>
            <div className="h-48 bg-white/[0.02] border border-white/5 rounded-xl relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 blueprint-grid opacity-25" />
              <MapPin size={32} className="text-primary animate-bounce relative z-10" />
              <span className="absolute bottom-4 text-[9px] uppercase tracking-[1px] text-white/50">{project.location}</span>
            </div>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-concrete">Airport Hub Junction</span>
                <span className="font-bold text-white">25 Mins</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-concrete">Central Railway Terminal</span>
                <span className="font-bold text-white">15 Mins</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-concrete">Higher Sec School</span>
                <span className="font-bold text-white">5 Mins</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ======================================================== */}
      {/* 8. RELATED PROJECTS */}
      {/* ======================================================== */}
      {relatedProjects.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-16 border-t border-white/5">
          <span className="text-primary text-[10px] font-sans font-bold tracking-[3px] uppercase block mb-4">PORTFOLIO ACCENTS</span>
          <h2 className="font-serif-display text-3xl md:text-5xl font-bold mb-12">Related Commissions</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProjects.map((p) => (
              <motion.div
                key={p._id || p.id}
                onClick={() => navigate(`/project/${p.slug || p.id}`)}
                className="group cursor-pointer relative bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden h-72 shadow-xl"
              >
                <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                  <h4 className="font-serif-display text-lg font-bold text-white group-hover:text-primary transition-colors">{p.name}</h4>
                  <span className="text-[9px] uppercase tracking-[1px] text-gray-concrete block mt-1">{p.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom spacer line */}
      <div className="h-10 bg-gradient-to-t from-dark-2 to-dark relative border-t border-white/5" />
    </div>
  );
};

export default ProjectDetails;
