"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataService = void 0;
const db_1 = require("./db");
const schemas_1 = require("../models/schemas");
// Helper to generate a random ID for fallback database items
const generateId = () => Math.random().toString(36).substring(2, 11);
exports.dataService = {
    // PROJECTS
    async getProjects() {
        if ((0, db_1.isMongoConnected)()) {
            return await schemas_1.ProjectModel.find().lean();
        }
        else {
            const db = (0, db_1.readLocalDB)();
            return db.projects;
        }
    },
    async getProjectById(id) {
        if ((0, db_1.isMongoConnected)()) {
            try {
                return await schemas_1.ProjectModel.findById(id).lean();
            }
            catch (e) {
                // Fallback to checking by string slug or id if MongoDB ObjectId check fails
                return await schemas_1.ProjectModel.findOne({ id }).lean();
            }
        }
        else {
            const db = (0, db_1.readLocalDB)();
            return db.projects.find(p => p.id === id || p._id === id);
        }
    },
    async createProject(projectData) {
        if ((0, db_1.isMongoConnected)()) {
            const newProj = new schemas_1.ProjectModel(projectData);
            return await newProj.save();
        }
        else {
            const db = (0, db_1.readLocalDB)();
            const newProj = {
                ...projectData,
                id: projectData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                _id: generateId()
            };
            db.projects.push(newProj);
            (0, db_1.writeLocalDB)(db);
            return newProj;
        }
    },
    async updateProject(id, projectData) {
        if ((0, db_1.isMongoConnected)()) {
            try {
                return await schemas_1.ProjectModel.findByIdAndUpdate(id, projectData, { new: true });
            }
            catch (e) {
                return await schemas_1.ProjectModel.findOneAndUpdate({ id }, projectData, { new: true });
            }
        }
        else {
            const db = (0, db_1.readLocalDB)();
            const idx = db.projects.findIndex(p => p.id === id || p._id === id);
            if (idx !== -1) {
                db.projects[idx] = { ...db.projects[idx], ...projectData };
                (0, db_1.writeLocalDB)(db);
                return db.projects[idx];
            }
            return null;
        }
    },
    async deleteProject(id) {
        if ((0, db_1.isMongoConnected)()) {
            try {
                return await schemas_1.ProjectModel.findByIdAndDelete(id);
            }
            catch (e) {
                return await schemas_1.ProjectModel.findOneAndDelete({ id });
            }
        }
        else {
            const db = (0, db_1.readLocalDB)();
            const idx = db.projects.findIndex(p => p.id === id || p._id === id);
            if (idx !== -1) {
                const deleted = db.projects.splice(idx, 1)[0];
                (0, db_1.writeLocalDB)(db);
                return deleted;
            }
            return null;
        }
    },
    // TESTIMONIALS
    async getTestimonials() {
        if ((0, db_1.isMongoConnected)()) {
            return await schemas_1.TestimonialModel.find().lean();
        }
        else {
            return (0, db_1.readLocalDB)().testimonials;
        }
    },
    async createTestimonial(data) {
        if ((0, db_1.isMongoConnected)()) {
            const test = new schemas_1.TestimonialModel(data);
            return await test.save();
        }
        else {
            const db = (0, db_1.readLocalDB)();
            const test = { ...data, _id: generateId(), id: generateId() };
            db.testimonials.push(test);
            (0, db_1.writeLocalDB)(db);
            return test;
        }
    },
    async deleteTestimonial(id) {
        if ((0, db_1.isMongoConnected)()) {
            return await schemas_1.TestimonialModel.findByIdAndDelete(id);
        }
        else {
            const db = (0, db_1.readLocalDB)();
            const idx = db.testimonials.findIndex(t => t.id === id || t._id === id);
            if (idx !== -1) {
                const deleted = db.testimonials.splice(idx, 1)[0];
                (0, db_1.writeLocalDB)(db);
                return deleted;
            }
            return null;
        }
    },
    // SERVICES
    async getServices() {
        if ((0, db_1.isMongoConnected)()) {
            return await schemas_1.ServiceModel.find().lean();
        }
        else {
            return (0, db_1.readLocalDB)().services;
        }
    },
    async updateService(id, data) {
        if ((0, db_1.isMongoConnected)()) {
            return await schemas_1.ServiceModel.findByIdAndUpdate(id, data, { new: true });
        }
        else {
            const db = (0, db_1.readLocalDB)();
            const idx = db.services.findIndex(s => s.id === id || s._id === id);
            if (idx !== -1) {
                db.services[idx] = { ...db.services[idx], ...data };
                (0, db_1.writeLocalDB)(db);
                return db.services[idx];
            }
            return null;
        }
    },
    // SUBMISSIONS
    async getSubmissions() {
        if ((0, db_1.isMongoConnected)()) {
            return await schemas_1.SubmissionModel.find().sort({ date: -1 }).lean();
        }
        else {
            return [...(0, db_1.readLocalDB)().submissions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
    },
    async createSubmission(data) {
        if ((0, db_1.isMongoConnected)()) {
            const sub = new schemas_1.SubmissionModel(data);
            return await sub.save();
        }
        else {
            const db = (0, db_1.readLocalDB)();
            const sub = {
                ...data,
                _id: generateId(),
                id: generateId(),
                status: 'unread',
                date: new Date().toISOString()
            };
            db.submissions.push(sub);
            (0, db_1.writeLocalDB)(db);
            return sub;
        }
    },
    async updateSubmissionStatus(id, status) {
        if ((0, db_1.isMongoConnected)()) {
            return await schemas_1.SubmissionModel.findByIdAndUpdate(id, { status }, { new: true });
        }
        else {
            const db = (0, db_1.readLocalDB)();
            const idx = db.submissions.findIndex(s => s.id === id || s._id === id);
            if (idx !== -1) {
                db.submissions[idx].status = status;
                (0, db_1.writeLocalDB)(db);
                return db.submissions[idx];
            }
            return null;
        }
    },
    // SETTINGS (SEO, contact info)
    async getSettings() {
        if ((0, db_1.isMongoConnected)()) {
            let settings = await schemas_1.SettingsModel.findOne().lean();
            if (!settings) {
                // Create default settings if empty
                const def = new schemas_1.SettingsModel((0, db_1.readLocalDB)().settings);
                await def.save();
                return def.toObject();
            }
            return settings;
        }
        else {
            return (0, db_1.readLocalDB)().settings;
        }
    },
    async updateSettings(data) {
        if ((0, db_1.isMongoConnected)()) {
            let settings = await schemas_1.SettingsModel.findOne();
            if (settings) {
                Object.assign(settings, data);
                return await settings.save();
            }
            else {
                const newSettings = new schemas_1.SettingsModel(data);
                return await newSettings.save();
            }
        }
        else {
            const db = (0, db_1.readLocalDB)();
            db.settings = { ...db.settings, ...data };
            (0, db_1.writeLocalDB)(db);
            return db.settings;
        }
    },
    // USERS (Auth)
    async getUserByUsername(username) {
        if ((0, db_1.isMongoConnected)()) {
            return await schemas_1.UserModel.findOne({ username }).lean();
        }
        else {
            // In local fallback mode, we check users. Since we don't have users by default in fallback,
            // we'll allow a default user 'admin' with a hashed password, or let the app register/validate it
            // Let's create a default admin in our initial fallback if it doesn't exist
            const db = (0, db_1.readLocalDB)();
            if (!db.users) {
                db.users = [
                    {
                        username: "admin",
                        // default password hash for 'admin123'
                        passwordHash: "$2a$10$ceOy9FtqzlDo6p9o4q5KouFPiwr/gvxgVpZsOhFsFV0qurMI3IVKi"
                    }
                ];
                (0, db_1.writeLocalDB)(db);
            }
            return db.users.find((u) => u.username === username);
        }
    },
    async createUser(username, passwordHash) {
        if ((0, db_1.isMongoConnected)()) {
            const user = new schemas_1.UserModel({ username, passwordHash });
            return await user.save();
        }
        else {
            const db = (0, db_1.readLocalDB)();
            if (!db.users)
                db.users = [];
            const user = { username, passwordHash, _id: generateId() };
            db.users.push(user);
            (0, db_1.writeLocalDB)(db);
            return user;
        }
    }
};
