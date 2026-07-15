import { isMongoConnected, readLocalDB, writeLocalDB } from './db';
import {
  ProjectModel,
  TestimonialModel,
  ServiceModel,
  SubmissionModel,
  UserModel,
  SettingsModel
} from '../models/schemas';

// Helper to generate a random ID for fallback database items
const generateId = () => Math.random().toString(36).substring(2, 11);

export const dataService = {
  // PROJECTS
  async getProjects() {
    if (isMongoConnected()) {
      return await ProjectModel.find().lean();
    } else {
      const db = readLocalDB();
      return db.projects;
    }
  },

  async getProjectById(id: string) {
    if (isMongoConnected()) {
      try {
        return await ProjectModel.findById(id).lean();
      } catch (e) {
        // Fallback to checking by string slug or id if MongoDB ObjectId check fails
        return await ProjectModel.findOne({ id }).lean();
      }
    } else {
      const db = readLocalDB();
      return db.projects.find(p => p.id === id || (p as any)._id === id);
    }
  },

  async createProject(projectData: any) {
    if (isMongoConnected()) {
      const newProj = new ProjectModel(projectData);
      return await newProj.save();
    } else {
      const db = readLocalDB();
      const newProj = {
        ...projectData,
        id: projectData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        _id: generateId()
      };
      db.projects.push(newProj);
      writeLocalDB(db);
      return newProj;
    }
  },

  async updateProject(id: string, projectData: any) {
    if (isMongoConnected()) {
      try {
        return await ProjectModel.findByIdAndUpdate(id, projectData, { new: true });
      } catch (e) {
        return await ProjectModel.findOneAndUpdate({ id }, projectData, { new: true });
      }
    } else {
      const db = readLocalDB();
      const idx = db.projects.findIndex(p => p.id === id || (p as any)._id === id);
      if (idx !== -1) {
        db.projects[idx] = { ...db.projects[idx], ...projectData };
        writeLocalDB(db);
        return db.projects[idx];
      }
      return null;
    }
  },

  async deleteProject(id: string) {
    if (isMongoConnected()) {
      try {
        return await ProjectModel.findByIdAndDelete(id);
      } catch (e) {
        return await ProjectModel.findOneAndDelete({ id });
      }
    } else {
      const db = readLocalDB();
      const idx = db.projects.findIndex(p => p.id === id || (p as any)._id === id);
      if (idx !== -1) {
        const deleted = db.projects.splice(idx, 1)[0];
        writeLocalDB(db);
        return deleted;
      }
      return null;
    }
  },

  // TESTIMONIALS
  async getTestimonials() {
    if (isMongoConnected()) {
      return await TestimonialModel.find().lean();
    } else {
      return readLocalDB().testimonials;
    }
  },

  async createTestimonial(data: any) {
    if (isMongoConnected()) {
      const test = new TestimonialModel(data);
      return await test.save();
    } else {
      const db = readLocalDB();
      const test = { ...data, _id: generateId(), id: generateId() };
      db.testimonials.push(test);
      writeLocalDB(db);
      return test;
    }
  },

  async deleteTestimonial(id: string) {
    if (isMongoConnected()) {
      return await TestimonialModel.findByIdAndDelete(id);
    } else {
      const db = readLocalDB();
      const idx = db.testimonials.findIndex(t => (t as any).id === id || (t as any)._id === id);
      if (idx !== -1) {
        const deleted = db.testimonials.splice(idx, 1)[0];
        writeLocalDB(db);
        return deleted;
      }
      return null;
    }
  },

  // SERVICES
  async getServices() {
    if (isMongoConnected()) {
      return await ServiceModel.find().lean();
    } else {
      return readLocalDB().services;
    }
  },

  async updateService(id: string, data: any) {
    if (isMongoConnected()) {
      return await ServiceModel.findByIdAndUpdate(id, data, { new: true });
    } else {
      const db = readLocalDB();
      const idx = db.services.findIndex(s => s.id === id || (s as any)._id === id);
      if (idx !== -1) {
        db.services[idx] = { ...db.services[idx], ...data };
        writeLocalDB(db);
        return db.services[idx];
      }
      return null;
    }
  },

  // SUBMISSIONS
  async getSubmissions() {
    if (isMongoConnected()) {
      return await SubmissionModel.find().sort({ date: -1 }).lean();
    } else {
      return [...readLocalDB().submissions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  },

  async createSubmission(data: any) {
    if (isMongoConnected()) {
      const sub = new SubmissionModel(data);
      return await sub.save();
    } else {
      const db = readLocalDB();
      const sub = {
        ...data,
        _id: generateId(),
        id: generateId(),
        status: 'unread',
        date: new Date().toISOString()
      };
      db.submissions.push(sub);
      writeLocalDB(db);
      return sub;
    }
  },

  async updateSubmissionStatus(id: string, status: string) {
    if (isMongoConnected()) {
      return await SubmissionModel.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      const db = readLocalDB();
      const idx = db.submissions.findIndex(s => (s as any).id === id || (s as any)._id === id);
      if (idx !== -1) {
        db.submissions[idx].status = status as any;
        writeLocalDB(db);
        return db.submissions[idx];
      }
      return null;
    }
  },

  // SETTINGS (SEO, contact info)
  async getSettings() {
    if (isMongoConnected()) {
      let settings = await SettingsModel.findOne().lean();
      if (!settings) {
        // Create default settings if empty
        const def = new SettingsModel(readLocalDB().settings);
        await def.save();
        return def.toObject();
      }
      return settings;
    } else {
      return readLocalDB().settings;
    }
  },

  async updateSettings(data: any) {
    if (isMongoConnected()) {
      let settings = await SettingsModel.findOne();
      if (settings) {
        Object.assign(settings, data);
        return await settings.save();
      } else {
        const newSettings = new SettingsModel(data);
        return await newSettings.save();
      }
    } else {
      const db = readLocalDB();
      db.settings = { ...db.settings, ...data };
      writeLocalDB(db);
      return db.settings;
    }
  },

  // USERS (Auth)
  async getUserByUsername(username: string) {
    if (isMongoConnected()) {
      return await UserModel.findOne({ username }).lean();
    } else {
      // In local fallback mode, we check users. Since we don't have users by default in fallback,
      // we'll allow a default user 'admin' with a hashed password, or let the app register/validate it
      // Let's create a default admin in our initial fallback if it doesn't exist
      const db = readLocalDB();
      if (!(db as any).users) {
        (db as any).users = [
          {
            username: "admin",
            // default password hash for 'admin123'
            passwordHash: "$2a$10$ceOy9FtqzlDo6p9o4q5KouFPiwr/gvxgVpZsOhFsFV0qurMI3IVKi"
          }
        ];
        writeLocalDB(db);
      }
      return (db as any).users.find((u: any) => u.username === username);
    }
  },

  async createUser(username: string, passwordHash: string) {
    if (isMongoConnected()) {
      const user = new UserModel({ username, passwordHash });
      return await user.save();
    } else {
      const db = readLocalDB();
      if (!(db as any).users) (db as any).users = [];
      const user = { username, passwordHash, _id: generateId() };
      (db as any).users.push(user);
      writeLocalDB(db);
      return user;
    }
  }
};
