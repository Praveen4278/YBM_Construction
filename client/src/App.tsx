import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

// Pages
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import CompletedProjects from './pages/CompletedProjects';
import UpcomingProjects from './pages/UpcomingProjects';
import JointVenture from './pages/JointVenture';

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <Router>
        <Routes>
          {/* Main Website */}
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/completed" element={<CompletedProjects />} />
          <Route path="/projects/upcoming" element={<UpcomingProjects />} />
          <Route path="/joint-venture" element={<JointVenture />} />
          <Route path="/project/:slug" element={<ProjectDetails />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />

          {/* CMS Admin Console */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </Router>
    </ReactLenis>
  );
}

export default App;
