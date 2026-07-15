import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../utils/api';
import { 
  BarChart3, 
  Briefcase, 
  Building, 
  Compass, 
  FileText, 
  Globe, 
  HelpCircle, 
  Inbox, 
  LogOut, 
  MessageSquare, 
  Plus, 
  Settings, 
  Trash2, 
  User, 
  Check, 
  X, 
  Edit3,
  Calendar,
  Ruler,
  Upload,
  Star
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'services' | 'testimonials' | 'submissions' | 'settings'>('overview');
  const [adminUser, setAdminUser] = useState('');

  // Site Data States
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [seoSettings, setSeoSettings] = useState<any>({});
  const [analytics, setAnalytics] = useState<any>(null);

  // Edit/Add Modals or States
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projectForm, setProjectForm] = useState<any>({
    name: '', slug: '', client: '', location: '', year: 2026, area: '', type: 'residential', category: 'apartment', status: 'completed', tag: 'Completed',
    description: '', image: '', gallery: '', videos: '', brochure: '', brochureUrl: '',
    specs: { structure: '', flooring: '', kitchen: '', doors: '' },
    modelConfig: { type: 'villa', color: '#d4a853', wireframe: false },
    seo: { title: '', description: '', keywords: '' },
    featured: false,
    timeline: ''
  });

  const [editingService, setEditingService] = useState<any>(null);
  const [serviceForm, setServiceForm] = useState<any>({ title: '', description: '', image: '' });

  const [testimonialForm, setTestimonialForm] = useState<any>({ author: '', project: '', text: '', avatar: '', rating: 5 });

  const [settingsForm, setSettingsForm] = useState<any>({
    seoTitle: '', seoDescription: '', seoKeywords: '', phone: '', email: '', address: ''
  });

  // Verify authentication
  useEffect(() => {
    const token = localStorage.getItem('ybm_admin_token');
    const user = localStorage.getItem('ybm_admin_user');
    if (!token || !user) {
      navigate('/admin/login');
    } else {
      setAdminUser(user);
    }
  }, [navigate]);

  // Load all dashboard content
  const loadDashboardData = async () => {
    try {
      const [projs, servs, tests, subs, setts, anals] = await Promise.all([
        apiService.getProjects(),
        apiService.getServices(),
        apiService.getTestimonials(),
        apiService.getSubmissions(),
        apiService.getSettings(),
        apiService.getAnalytics()
      ]);
      setProjects(projs || []);
      setServices(servs || []);
      setTestimonials(tests || []);
      setSubmissions(subs || []);
      setSeoSettings(setts || {});
      setSettingsForm(setts || {});
      setAnalytics(anals || null);
    } catch (e) {
      console.warn("Failed fetching CMS console details:", e);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ybm_admin_token');
    localStorage.removeItem('ybm_admin_user');
    navigate('/admin/login');
  };

  // Submission helpers
  const handleToggleSubStatus = async (id: string, current: string) => {
    const nextStatus = current === 'unread' ? 'in-progress' : current === 'in-progress' ? 'replied' : 'unread';
    try {
      await apiService.updateSubmissionStatus(id, nextStatus as any);
      loadDashboardData();
    } catch (err) {
      alert("Failed updating lead status");
    }
  };

  // Projects CRUD Actions
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingField(fieldName);
      const res = await apiService.uploadFile(file);
      if (res && res.url) {
        if (fieldName === 'image') {
          setProjectForm((prev: any) => ({ ...prev, image: res.url }));
        } else if (fieldName === 'brochure') {
          setProjectForm((prev: any) => ({ ...prev, brochure: file.name, brochureUrl: res.url }));
        } else if (fieldName === 'gallery') {
          setProjectForm((prev: any) => {
            const current = prev.gallery ? prev.gallery.trim() : '';
            const updated = current ? `${current}, ${res.url}` : res.url;
            return { ...prev, gallery: updated };
          });
        }
      }
    } catch (err) {
      alert("Failed to upload file");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Split gallery string into array
      const galleryArray = typeof projectForm.gallery === 'string'
        ? projectForm.gallery.split(',').map((img: string) => img.trim()).filter((img: string) => img.length > 0)
        : projectForm.gallery;

      // Split videos string into array
      const videosArray = typeof projectForm.videos === 'string'
        ? projectForm.videos.split(',').map((v: string) => v.trim()).filter((v: string) => v.length > 0)
        : projectForm.videos;

      // Convert timeline comma separated string into objects array
      const timelineArray = typeof projectForm.timeline === 'string'
        ? projectForm.timeline.split(',').map((t: string) => ({
            title: t.trim(),
            status: 'completed',
            date: projectForm.year ? String(projectForm.year) : '2026',
            description: `${t.trim()} phase completed successfully.`
          })).filter((t: any) => t.title.length > 0)
        : projectForm.timeline;

      // Automatically generate slug if empty
      const projectSlug = projectForm.slug.trim() 
        ? projectForm.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : projectForm.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const submitData = {
        ...projectForm,
        slug: projectSlug,
        gallery: galleryArray,
        videos: videosArray,
        timeline: timelineArray
      };

      if (editingProject) {
        await apiService.updateProject(editingProject._id || editingProject.id, submitData);
      } else {
        await apiService.createProject(submitData);
      }

      setEditingProject(null);
      setProjectForm({
        name: '', slug: '', client: '', location: '', year: 2026, area: '', type: 'residential', category: 'apartment', status: 'completed', tag: 'Completed',
        description: '', image: '', gallery: '', videos: '', brochure: '', brochureUrl: '',
        specs: { structure: '', flooring: '', kitchen: '', doors: '' },
        modelConfig: { type: 'villa', color: '#d4a853', wireframe: false },
        seo: { title: '', description: '', keywords: '' },
        featured: false,
        timeline: ''
      });
      loadDashboardData();
    } catch (err) {
      alert("Failed to save project.");
    }
  };

  const handleEditProjectClick = (p: any) => {
    setEditingProject(p);
    setProjectForm({
      name: p.name || '',
      slug: p.slug || p.id || '',
      client: p.client || '',
      location: p.location || '',
      year: p.year || 2026,
      area: p.area || '',
      type: p.type || 'residential',
      category: p.category || 'apartment',
      status: p.status || 'completed',
      tag: p.tag || 'Completed',
      description: p.description || '',
      image: p.image || '',
      gallery: p.gallery ? p.gallery.join(', ') : '',
      videos: p.videos ? p.videos.join(', ') : '',
      brochure: p.brochure || '',
      brochureUrl: p.brochureUrl || '',
      specs: p.specs || { structure: '', flooring: '', kitchen: '', doors: '' },
      modelConfig: p.modelConfig || { type: 'villa', color: '#d4a853', wireframe: false },
      seo: p.seo || { title: '', description: '', keywords: '' },
      featured: p.featured || false,
      timeline: p.timeline ? p.timeline.map((t: any) => t.title).join(', ') : ''
    });
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await apiService.deleteProject(id);
        loadDashboardData();
      } catch (err) {
        alert("Failed to delete project");
      }
    }
  };

  // Services actions
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.updateService(editingService._id || editingService.id, serviceForm);
      setEditingService(null);
      loadDashboardData();
    } catch (e) {
      alert("Failed saving service");
    }
  };

  const handleEditServiceClick = (s: any) => {
    setEditingService(s);
    setServiceForm({ title: s.title, description: s.description, image: s.image });
  };

  // Testimonial actions
  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createTestimonial(testimonialForm);
      setTestimonialForm({ author: '', project: '', text: '', avatar: '', rating: 5 });
      loadDashboardData();
    } catch (err) {
      alert("Failed creating review");
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm("Delete this client review?")) {
      try {
        await apiService.deleteTestimonial(id);
        loadDashboardData();
      } catch (e) {
        alert("Failed deleting review");
      }
    }
  };

  // Settings Actions
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.updateSettings(settingsForm);
      alert("SEO Settings updated successfully!");
      loadDashboardData();
    } catch (err) {
      alert("Failed updating site settings.");
    }
  };

  // Analytics Colors
  const COLORS = ['#d4a853', '#0f172a'];

  return (
    <div className="min-h-screen bg-slate-50 flex text-dark font-sans">
      
      {/* 1. GLASS Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6">
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-200">
            <img src="/Logo.png" alt="Logo" className="h-6 w-auto object-contain" />
            <div>
              <span className="font-serif-display text-sm tracking-[1px] font-bold text-dark block">YBM CONSOLE</span>
              <span className="text-[9px] text-primary tracking-[1px] uppercase">Logged as: {adminUser}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 text-xs font-bold tracking-[1.5px] uppercase">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
              { id: 'projects', label: 'Projects CRUD', icon: <Building size={16} /> },
              { id: 'services', label: 'Services CMS', icon: <Compass size={16} /> },
              { id: 'testimonials', label: 'Reviews', icon: <MessageSquare size={16} /> },
              { id: 'submissions', label: `Inquiries (${submissions.filter(s => s.status === 'unread').length})`, icon: <Inbox size={16} /> },
              { id: 'settings', label: 'SEO & Settings', icon: <Settings size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setEditingProject(null);
                  setEditingService(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div>
          <a href="/" target="_blank" className="w-full text-center text-[10px] text-primary hover:underline block mb-4">View Main Site</a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-red-300 hover:bg-red-50 text-xs font-bold uppercase tracking-[1px] py-3 rounded-lg transition-colors text-slate-500 hover:text-red-500"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* 2. Content Space */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12">

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fade-in">
            <h2 className="font-serif-display text-3xl font-bold text-dark">Dashboard Overview</h2>
            
            {/* Stats Metrics row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Unread Leads', val: submissions.filter(s => s.status === 'unread').length, color: 'border-primary' },
                { label: 'Total Inquiries', val: submissions.length, color: 'border-white/10' },
                { label: 'Portfolios Listed', val: projects.length, color: 'border-white/10' },
                { label: 'Testimonials', val: testimonials.length, color: 'border-white/10' }
              ].map((m, idx) => (
                <div key={idx} className={`bg-white border border-slate-200 p-6 rounded-xl border-l-4 ${m.color} shadow-sm`}>
                  <span className="text-[10px] text-slate-500 uppercase tracking-[1.5px] font-bold block mb-1">{m.label}</span>
                  <span className="text-3xl font-sans font-bold text-dark">{m.val}</span>
                </div>
              ))}
            </div>

            {/* Graphs / Recharts layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl h-[350px] shadow-sm">
                <h3 className="text-xs uppercase font-sans tracking-[1.5px] text-primary mb-6">Traffic & Leads (Mock Metrics)</h3>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={analytics?.charts?.pageViews || []}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4a853" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#d4a853" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', color: '#031124' }} />
                    <Area type="monotone" dataKey="views" stroke="#d4a853" fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart Distribution */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl h-[350px] flex flex-col justify-between shadow-sm">
                <h3 className="text-xs uppercase font-sans tracking-[1.5px] text-primary">Class Distribution</h3>
                <div className="h-[200px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics?.charts?.distribution || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {(analytics?.charts?.distribution || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-around text-xs text-slate-500">
                  <span className="flex items-center gap-2 text-slate-600"><div className="w-3 h-3 bg-primary rounded-full" /> Residential</span>
                  <span className="flex items-center gap-2 text-slate-600"><div className="w-3 h-3 bg-slate-300 rounded-full" /> Commercial</span>
                </div>
              </div>
            </div>

            {/* Quick Leads List */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xs uppercase font-sans tracking-[1.5px] text-primary mb-6">Recent Leads</h3>
              <div className="divide-y divide-slate-100">
                {submissions.slice(0, 4).map((sub: any) => (
                  <div key={sub._id || sub.id} className="py-4 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-dark mb-1">{sub.name} &middot; <span className="text-primary font-normal">{sub.type}</span></h4>
                      <p className="text-slate-500">{sub.email} &middot; {sub.phone}</p>
                    </div>
                    <span className={`px-3 py-1 rounded font-bold uppercase tracking-[1px] text-[9px] ${sub.status === 'unread' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/5 text-gray'}`}>
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS CRUD */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="font-serif-display text-3xl font-bold text-dark">Projects CMS</h2>
              {!editingProject && (
                <button
                  onClick={() => handleEditProjectClick({ name: '', specs: {}, modelConfig: {} })}
                  className="bg-primary hover:bg-white text-dark-2 text-[10px] font-sans font-bold tracking-[2px] px-6 py-3 rounded uppercase flex items-center gap-2 transition-colors"
                >
                  <Plus size={14} /> Add Project
                </button>
              )}
            </div>

            {/* Editing / Create Form Drawer */}
            {editingProject ? (
              <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <h3 className="font-serif-display text-xl font-bold text-dark">{editingProject.id ? 'Edit Project' : 'New Project'}</h3>
                  <button onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-dark"><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSaveProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Project Name</label>
                    <input type="text" required value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Slug Route (/project/:slug)</label>
                    <input type="text" value={projectForm.slug} onChange={e => setProjectForm({...projectForm, slug: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" placeholder="auto-generated-from-name" />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Location</label>
                    <input type="text" value={projectForm.location} onChange={e => setProjectForm({...projectForm, location: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" placeholder="Chetpet, Chennai" />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Client</label>
                    <input type="text" value={projectForm.client} onChange={e => setProjectForm({...projectForm, client: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Year</label>
                      <input type="number" value={projectForm.year} onChange={e => setProjectForm({...projectForm, year: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Area size</label>
                      <input type="text" value={projectForm.area} onChange={e => setProjectForm({...projectForm, area: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" placeholder="150,000 Sq.Ft" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Type</label>
                      <select value={projectForm.type} onChange={e => setProjectForm({...projectForm, type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary">
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Category</label>
                      <select value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary">
                        <option value="villa">Luxury Villa</option>
                        <option value="apartment">Apartment</option>
                        <option value="tower">Commercial Tower</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Status</label>
                      <select value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary">
                        <option value="completed">Completed</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Overlay Tag</label>
                      <input type="text" value={projectForm.tag} onChange={e => setProjectForm({...projectForm, tag: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" placeholder="Flagship, Completed, etc." />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block flex items-center justify-between">
                      <span>Cover Image URL</span>
                      <span className="text-[8px] text-primary cursor-pointer hover:underline relative">
                        Upload File
                        <input type="file" onChange={e => handleFileUpload(e, 'image')} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </span>
                    </label>
                    <input type="text" value={projectForm.image} onChange={e => setProjectForm({...projectForm, image: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block flex items-center justify-between">
                      <span>Gallery Images (Comma separated URLs)</span>
                      <span className="text-[8px] text-primary cursor-pointer hover:underline relative">
                        Upload Image
                        <input type="file" onChange={e => handleFileUpload(e, 'gallery')} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </span>
                    </label>
                    <input type="text" value={projectForm.gallery} onChange={e => setProjectForm({...projectForm, gallery: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" placeholder="url1, url2, url3" />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block flex items-center justify-between">
                      <span>Brochure File URL</span>
                      <span className="text-[8px] text-primary cursor-pointer hover:underline relative">
                        Upload PDF
                        <input type="file" accept=".pdf" onChange={e => handleFileUpload(e, 'brochure')} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </span>
                    </label>
                    <input type="text" value={projectForm.brochureUrl} onChange={e => setProjectForm({...projectForm, brochureUrl: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" placeholder="/static-assets/uploads/filename.pdf" />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Video URLs (Comma separated)</label>
                    <input type="text" value={projectForm.videos} onChange={e => setProjectForm({...projectForm, videos: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" placeholder="url1, url2" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Timeline Milestones (Comma separated list of stages)</label>
                    <input type="text" value={projectForm.timeline} onChange={e => setProjectForm({...projectForm, timeline: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" placeholder="Planning, Foundation, Structure, Interior, Completion" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Description</label>
                    <textarea rows={2} value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary resize-none" />
                  </div>

                  {/* 3D Model Configuration */}
                  <div className="md:col-span-2 border-t border-slate-200 pt-4">
                    <h4 className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-primary mb-4">3D Canvas Setup</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[9px] text-slate-500 mb-1 block">3D Mesh Type</label>
                        <select value={projectForm.modelConfig.type} onChange={e => setProjectForm({...projectForm, modelConfig: {...projectForm.modelConfig, type: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-dark">
                          <option value="villa">Villa Model</option>
                          <option value="tower">Skyscraper Tower</option>
                          <option value="apartment">Apartment Blocks</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500 mb-1 block">GL Material Color</label>
                        <input type="text" value={projectForm.modelConfig.color} onChange={e => setProjectForm({...projectForm, modelConfig: {...projectForm.modelConfig, color: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-dark" placeholder="#d4a853" />
                      </div>
                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input type="checkbox" checked={projectForm.modelConfig.wireframe} onChange={e => setProjectForm({...projectForm, modelConfig: {...projectForm.modelConfig, wireframe: e.target.checked}})} className="rounded border-white/10 bg-dark-2/50 text-primary focus:ring-0 focus:ring-offset-0" />
                          <span>Wireframe Blueprint Default</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* SEO Configuration */}
                  <div className="md:col-span-2 border-t border-slate-200 pt-4">
                    <h4 className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-primary mb-4">SEO Metadata</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] text-slate-500 mb-1 block">Meta Title</label>
                          <input type="text" value={projectForm.seo?.title || ''} onChange={e => setProjectForm({...projectForm, seo: {...projectForm.seo, title: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-dark" />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 mb-1 block">Meta Keywords</label>
                          <input type="text" value={projectForm.seo?.keywords || ''} onChange={e => setProjectForm({...projectForm, seo: {...projectForm.seo, keywords: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-dark" placeholder="keywords, comma, separated" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500 mb-1 block">Meta Description</label>
                        <textarea rows={2} value={projectForm.seo?.description || ''} onChange={e => setProjectForm({...projectForm, seo: {...projectForm.seo, description: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-dark resize-none" />
                      </div>
                    </div>
                  </div>

                  {/* Featured & Special Toggles */}
                  <div className="md:col-span-2 border-t border-slate-200 pt-4 flex gap-6">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input type="checkbox" checked={projectForm.featured} onChange={e => setProjectForm({...projectForm, featured: e.target.checked})} className="rounded border-white/10 bg-dark-2/50 text-primary focus:ring-0 focus:ring-offset-0" />
                      <span className="flex items-center gap-1"><Star size={12} className="text-primary" /> Highlight as Featured Flagship Project</span>
                    </label>
                  </div>

                  {/* Specifications fields */}
                  <div className="md:col-span-2 border-t border-slate-200 pt-4">
                    <h4 className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-primary mb-4">Specs Checklist</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] text-slate-500 mb-1 block">Concrete Structure</label>
                        <input type="text" value={projectForm.specs.structure} onChange={e => setProjectForm({...projectForm, specs: {...projectForm.specs, structure: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-dark" />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500 mb-1 block">Flooring</label>
                        <input type="text" value={projectForm.specs.flooring} onChange={e => setProjectForm({...projectForm, specs: {...projectForm.specs, flooring: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-dark" />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500 mb-1 block">Kitchen</label>
                        <input type="text" value={projectForm.specs.kitchen} onChange={e => setProjectForm({...projectForm, specs: {...projectForm.specs, kitchen: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-dark" />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500 mb-1 block">Teakwood/Doors</label>
                        <input type="text" value={projectForm.specs.doors} onChange={e => setProjectForm({...projectForm, specs: {...projectForm.specs, doors: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-dark" />
                      </div>
                    </div>
                  </div>

                  {uploadingField && (
                    <div className="md:col-span-2 bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-sans font-bold tracking-[1px] p-3 rounded text-center animate-pulse">
                      Uploading {uploadingField}... Please wait.
                    </div>
                  )}

                  <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t border-slate-200 pt-6">
                    <button type="button" onClick={() => setEditingProject(null)} className="border border-slate-200 hover:bg-slate-50 px-6 py-3 text-dark rounded text-[10px] font-sans font-bold tracking-[1.5px] uppercase transition-colors">Cancel</button>
                    <button type="submit" disabled={!!uploadingField} className="bg-primary text-dark-2 px-6 py-3 rounded text-[10px] font-sans font-bold tracking-[1.5px] uppercase hover:bg-white transition-colors disabled:opacity-50">Save Changes</button>
                  </div>
                </form>
              </div>
            ) : (
              // Projects list table
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-primary text-[10px] font-bold tracking-[1px] uppercase">
                      <th className="p-6">Project Name</th>
                      <th className="p-6">Location</th>
                      <th className="p-6">Class</th>
                      <th className="p-6">Area</th>
                      <th className="p-6">Year</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.map((p: any) => (
                      <tr key={p._id || p.id} className="hover:bg-slate-50">
                        <td className="p-6 font-serif-display text-sm font-bold text-dark">{p.name}</td>
                        <td className="p-6 text-slate-500">{p.location}</td>
                        <td className="p-6 uppercase tracking-[1px] text-[10px]">{p.type}</td>
                        <td className="p-6 text-slate-500">{p.area}</td>
                        <td className="p-6 text-slate-500">{p.year}</td>
                        <td className="p-6 text-right flex justify-end gap-2 mt-1">
                          <button
                            onClick={() => handleEditProjectClick(p)}
                            className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:text-primary hover:border-primary transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p._id || p.id)}
                            className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:text-red-400 hover:border-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="font-serif-display text-3xl font-bold text-dark">Services CMS</h2>

            {editingService ? (
              <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <h3 className="font-serif-display text-xl font-bold text-dark">Edit Service</h3>
                  <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-dark"><X size={20} /></button>
                </div>
                <form onSubmit={handleSaveService} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Service Title</label>
                    <input type="text" required value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Description</label>
                    <textarea rows={4} required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary resize-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-bold tracking-[1.5px] uppercase text-slate-600 mb-2 block">Background Cover Image URL</label>
                    <input type="text" value={serviceForm.image} onChange={e => setServiceForm({...serviceForm, image: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" />
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                    <button type="button" onClick={() => setEditingService(null)} className="border border-slate-200 hover:bg-slate-50 px-6 py-3 text-dark rounded text-[10px] font-sans font-bold tracking-[1.5px] uppercase transition-colors">Cancel</button>
                    <button type="submit" className="bg-primary text-dark-2 px-6 py-3 rounded text-[10px] font-sans font-bold tracking-[1.5px] uppercase hover:bg-white transition-colors">Save Service</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((s: any) => (
                  <div key={s._id || s.id} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif-display text-xl text-dark font-bold mb-2">{s.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-6">{s.description}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200 pt-4">
                      <span className="text-[9px] text-primary tracking-[1px] uppercase">Icon: {s.icon}</span>
                      <button
                        onClick={() => handleEditServiceClick(s)}
                        className="border border-slate-200 hover:border-primary hover:text-primary px-4 py-2 rounded text-[10px] font-sans font-bold tracking-[1px] uppercase transition-all duration-300 flex items-center gap-2"
                      >
                        <Edit3 size={12} /> Edit Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="font-serif-display text-3xl font-bold text-dark">Client Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Add testimonial form */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm h-fit">
                <h3 className="text-xs uppercase font-sans tracking-[1.5px] text-primary mb-6">Add New Feedback</h3>
                <form onSubmit={handleCreateTestimonial} className="space-y-4">
                  <div>
                    <label className="text-[9px] text-white/60 uppercase tracking-[1px] mb-1.5 block">Author Name</label>
                    <input type="text" required value={testimonialForm.author} onChange={e => setTestimonialForm({...testimonialForm, author: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-dark focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[9px] text-white/60 uppercase tracking-[1px] mb-1.5 block">Project Info</label>
                    <input type="text" value={testimonialForm.project} onChange={e => setTestimonialForm({...testimonialForm, project: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-dark focus:outline-none focus:border-primary" placeholder="Sidharth Upscale - B502" />
                  </div>
                  <div>
                    <label className="text-[9px] text-white/60 uppercase tracking-[1px] mb-1.5 block">Feedback Text</label>
                    <textarea rows={4} required value={testimonialForm.text} onChange={e => setTestimonialForm({...testimonialForm, text: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-dark focus:outline-none focus:border-primary resize-none" />
                  </div>
                  <div>
                    <label className="text-[9px] text-white/60 uppercase tracking-[1px] mb-1.5 block">Avatar Image URL</label>
                    <input type="text" value={testimonialForm.avatar} onChange={e => setTestimonialForm({...testimonialForm, avatar: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-dark focus:outline-none focus:border-primary" />
                  </div>
                  
                  <button type="submit" className="w-full bg-primary hover:bg-white text-dark-2 font-sans font-bold tracking-[1px] text-[10px] py-3 rounded uppercase transition-colors">
                    Add Review
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                {testimonials.map((t: any) => (
                  <div key={t._id || t.id} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex gap-4 items-start justify-between">
                    <div className="flex gap-4 items-start">
                      <img src={t.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&fit=crop'} alt={t.author} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      <div>
                        <h4 className="font-bold text-dark text-xs mb-1">{t.author} &middot; <span className="text-primary font-normal">{t.project}</span></h4>
                        <p className="text-xs text-slate-500 leading-relaxed">"{t.text}"</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTestimonial(t._id || t.id)}
                      className="text-slate-400 hover:text-red-500 p-2 border border-slate-200 hover:border-red-300 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: INBOX SUBMISSIONS */}
        {activeTab === 'submissions' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="font-serif-display text-3xl font-bold text-dark">Leads Inbox</h2>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-primary text-[10px] font-bold tracking-[1px] uppercase">
                    <th className="p-6">Status</th>
                    <th className="p-6">Sender Details</th>
                    <th className="p-6">Type</th>
                    <th className="p-6">Message / Details</th>
                    <th className="p-6">Date</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub: any) => (
                    <tr key={sub._id || sub.id} className="hover:bg-slate-50">
                      <td className="p-6">
                        <button
                          onClick={() => handleToggleSubStatus(sub._id || sub.id, sub.status)}
                          className={`px-3 py-1.5 rounded font-bold uppercase tracking-[1px] text-[9px] ${
                            sub.status === 'unread' 
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                              : sub.status === 'in-progress' 
                                ? 'bg-primary/10 text-primary border border-primary/20' 
                                : 'bg-green-500/10 text-green-400 border border-green-500/20'
                          }`}
                        >
                          {sub.status}
                        </button>
                      </td>
                      <td className="p-6">
                        <div className="{font-bold text-dark">{sub.name}</div>
                        <div className="text-[10px] text-slate-500 mt-1">{sub.email}</div>
                        {sub.phone && <div className="text-[10px] text-slate-500">{sub.phone}</div>}
                      </td>
                      <td className="p-6 uppercase tracking-[1px] text-[10px] font-bold text-primary">{sub.type}</td>
                      <td className="p-6 max-w-xs text-slate-500">
                        {sub.message && <p className="mb-2 italic">"{sub.message}"</p>}
                        {sub.type === 'quote' && sub.details && (
                          <div className="bg-slate-100 p-2 rounded text-[10px] space-y-1">
                            <div>Project: {sub.details.projectType}</div>
                            <div>Budget: {sub.details.budget}</div>
                            <div>Area: {sub.details.areaSize}</div>
                          </div>
                        )}
                        {sub.type === 'visit' && sub.details && (
                          <div className="bg-slate-100 p-2 rounded text-[10px] space-y-1">
                            <div>Project: {sub.details.projectName}</div>
                            <div>Date Preferred: {sub.details.preferredDate}</div>
                          </div>
                        )}
                      </td>
                      <td className="p-6 text-slate-500">{new Date(sub.date).toLocaleDateString()}</td>
                      <td className="p-6 text-right">
                        <button
                          onClick={() => handleToggleSubStatus(sub._id || sub.id, sub.status)}
                          className="border border-slate-200 hover:border-primary hover:text-primary px-3 py-2 rounded text-[10px] font-sans font-bold tracking-[1px] uppercase transition-colors"
                        >
                          Mark Next
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: SEO SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="font-serif-display text-3xl font-bold text-dark">SEO & Site Configuration</h2>

            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm max-w-2xl">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <h3 className="text-xs uppercase font-sans tracking-[1.5px] text-primary mb-4">Meta Tags</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-sans font-bold tracking-[1px] uppercase text-slate-600 mb-2 block">HTML Title Tag</label>
                      <input type="text" required value={settingsForm.seoTitle} onChange={e => setSettingsForm({...settingsForm, seoTitle: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-[10px] font-sans font-bold tracking-[1px] uppercase text-slate-600 mb-2 block">Meta Description</label>
                      <textarea rows={3} value={settingsForm.seoDescription} onChange={e => setSettingsForm({...settingsForm, seoDescription: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary resize-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-sans font-bold tracking-[1px] uppercase text-slate-600 mb-2 block">Meta Search Keywords (Comma separated)</label>
                      <input type="text" value={settingsForm.seoKeywords} onChange={e => setSettingsForm({...settingsForm, seoKeywords: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-xs uppercase font-sans tracking-[1.5px] text-primary mb-4">Corporate Contact Info</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-sans font-bold tracking-[1px] uppercase text-slate-600 mb-2 block">Representative Phone</label>
                      <input type="text" value={settingsForm.phone} onChange={e => setSettingsForm({...settingsForm, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-[10px] font-sans font-bold tracking-[1px] uppercase text-slate-600 mb-2 block">Inquiry Email</label>
                      <input type="email" value={settingsForm.email} onChange={e => setSettingsForm({...settingsForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-[10px] font-sans font-bold tracking-[1px] uppercase text-slate-600 mb-2 block">Address</label>
                      <input type="text" value={settingsForm.address} onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button type="submit" className="bg-primary hover:bg-white text-dark-2 px-8 py-4 rounded text-[10px] font-sans font-bold tracking-[2px] uppercase transition-colors hover:shadow-premium-glow">
                    Save Site Configurations
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};

export default Dashboard;
