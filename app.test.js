import "@babel/polyfill";
import request from 'supertest';
import app from './app';
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run();
  });

  describe('init', () => {
    it('should return a 200 status', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should return a 200 and all of the projects', async () => {
      const expectedProjects = await database('projects').select();
      const res = await request(app).get('/api/v1/projects');
      const projects = res.body;
      expect(res.status).toBe(200);
      expect(projects[0].name).toEqual(expectedProjects[0].name);
      expect(projects[1].name).toEqual(expectedProjects[1].name);
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('should return a 200 and all of the palettes', async () => {
      const expectedPalettes = await database('palettes').select();
      const res = await request(app).get('/api/v1/palettes');
      const palettes = res.body;
      expect(res.status).toBe(200);
      expect(palettes[0].name).toEqual(expectedPalettes[0].name);
      expect(palettes[1].name).toEqual(expectedPalettes[1].name);
      expect(palettes[2].name).toEqual(expectedPalettes[2].name);
      expect(palettes[3].name).toEqual(expectedPalettes[3].name);
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should return a 200 and a specified project by id', async () => {
      const expectedProject = await database('projects').first();
      const { id } = expectedProject;
      const res = await request(app).get(`/api/v1/projects/${id}`);
      const project = res.body[0];
      expect(res.status).toBe(200);
      expect(project.name).toBe(expectedProject.name);
    });

    it('should return a 404 and "No project with that id exists"', async () => {
      const invalidId = -1;
      const expectedMsg = "No project with that id exists";
      const res = await request(app).get(`/api/v1/projects/${invalidId}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe(expectedMsg);
    });
  });

  describe('GET /api/v1/palettes/:id', () => {
    it('should return 200 and a specific palette by id', async () => {
      const expectedPalette = await database('palettes').first();
      const { id } = expectedPalette;
      const res = await request(app).get(`/api/v1/palettes/${id}`);
      const palette = res.body[0];
      expect(res.status).toBe(200);
      expect(palette.name).toBe(expectedPalette.name);
    });

    it('should return 404 and "No palette with that id exists"', async () => {
      const invalidId = -1;
      const expectedMsg = "No palette with that id exists";
      const res = await request(app).get(`/api/v1/palettes/${invalidId}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe(expectedMsg);
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should return a 201 and add a new project to the projects table', async () => {
      const newProject = { name: 'Test Project' };
      const res = await request(app).post('/api/v1/projects').send(newProject);
      expect(res.status).toBe(201);
      expect(res.body.name).toBe(newProject.name);
    });
  });
});