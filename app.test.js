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
});