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

    it('should return a 422 and appropriate error message', async () => {
      const res = await request(app).post('/api/v1/projects').send({});
      expect(res.status).toBe(422);
      expect(res.body.error).toBe('Required parameter of "name" is missing from request.');
    });
  });

  describe('POST /api/v1/palettes', () => {
    it('should return a 201 and add a new Palette to the Palettes table', async () => {
      const project = await database('projects').first();
      const newPalette = {
        name: 'Test Palette',
        color1: 'black',
        color2: 'blue',
        color3: 'green',
        color4: 'orange',
        color5: 'purple',
        project_id: project.id
      };
      const res = await request(app).post('/api/v1/palettes').send(newPalette);
      expect(res.status).toBe(201);
      expect(res.body.name).toBe(newPalette.name);
    });

    it('should return a 422 and appropriate error message if parameters are missing', async () => {
      const invalidPalette = { color1: 'blue', color2: 'green', color3: 'black', project_id: 88 };
      const res = await request(app).post('/api/v1/palettes').send(invalidPalette);
      expect(res.status).toBe(422);
      expect(res.body.error).toBe('Required parameter of "name" is missing from request.');
    });

    it('should return a 422 and appropriate error message if using duplicate palette name', async () => {
      const project = await database('projects').first();
      const invalidPalette = {
        name: 'Pastels',
        color1: 'black',
        color2: 'blue',
        color3: 'green',
        color4: 'orange',
        color5: 'purple',
        project_id: project.id
      };
      const res = await request(app).post('/api/v1/palettes').send(invalidPalette);
      expect(res.status).toBe(422);
      expect(res.body.error).toBe('Palette with that name already exists for that project_id');
    });

    it('should return a 404 and appropriate error message if using invalid project id', async () => {
      const invalidPalette = {
        name: 'Pastels',
        color1: 'black',
        color2: 'blue',
        color3: 'green',
        color4: 'orange',
        color5: 'purple',
        project_id: 1000000
      };
      const res = await request(app).post('/api/v1/palettes').send(invalidPalette);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('No project with that project id exists');
    });
  });

  describe('PATCH /api/v1/projects/:id', () => {
    it('should return 200 and the updated project', async () => {
      const nameChange = { name: "Chris' New Project" };
      const project = await database('projects').first();
      const expectedResponse = { id: project.id, name: nameChange.name }
      const res = await request(app).patch(`/api/v1/projects/${project.id}`).send(nameChange);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expectedResponse);
    });
  
    it('should return a 404 if the id is incorrect', async () => {
      const res = await request(app).patch('/api/v1/projects/1000000').send();
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('No project with that id exists');
    });

    it('should return a 422 if the name is missing', async () => {
      const project = await database('projects').first();
      const res = await request(app).patch(`/api/v1/projects/${project.id}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBe('Required parameter of "name" is missing from request.');
    });

    it('should return a 422 if the name is already in use', async () => {
      const project = await database('projects').first();
      const res = await request(app).patch(`/api/v1/projects/${project.id}`).send({name: "Amy's Colors"});
      expect(res.status).toBe(422);
      expect(res.body.error).toBe('Project with that name already exists');
    });
  });
});