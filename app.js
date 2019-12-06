import express from 'express';
import cors from 'cors';
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(cors())
app.use(express.json());

app.locals.title = 'Palette Picker';

app.get('/', (req, res) => {
  res.send('Welcome to Palette Picker!');
});

app.get('/api/v1/projects', async (req, res) => {
  try {
    const projects = await database('projects').select();
    const palettes = await database('palettes').select();
    const projsWithPalettes = projects.reduce((acc, project) => {
      const { id, name } = project;
      const projPalette = palettes.filter(palette => palette.project_id === project.id)
      acc.push({ id, name, palettes: projPalette });
      return acc;
    }, []);
    res.status(200).json(projsWithPalettes);
  } catch (error) {
    res.status(404).json({ error: 'No projects found' });
  };
});

app.get('/api/v1/palettes', async (req, res) => {
  try {
    const palettes = await database('palettes').select();
    res.status(200).json(palettes);
  } catch (error) {
    res.status(404).json({ error: 'No palettes found' });
  };
});

app.get('/api/v1/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await database('projects').where('id', id).select();
    if (project.length) {
      return res.status(200).json(project);
    }
    res.status(404).json({ error: 'No project with that id exists' });
  } catch (error) {
    res.status(500).json({ error });
  };
});

app.get('/api/v1/palettes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const palette = await database('palettes').where('id', id).select();
    if (palette.length) {
      return res.status(200).json(palette);
    }
    res.status(404).json({ error: 'No palette with that id exists' });
  } catch (error) {
    res.status(500).json({ error });
  };
});

app.post('/api/v1/projects', async (req, res) => {
  const newProject = req.body;
  for (let requiredParam of ['name']) {
    if (!newProject[requiredParam]) {
      return res.status(422).send({
        error: `Required parameter of "${requiredParam}" is missing from request.`
      });
    };
  };
  try {
    const validProject = await database('projects').insert(newProject, 'id');
    res.status(201).json({
      id: validProject[0],
      name: newProject.name
    });
  } catch (error) {
    res.status(500).json({ error });
  };
});

app.post('/api/v1/palettes', async (req, res) => {
  const newPalette = req.body;
  const palettes = await database('palettes').where('project_id', newPalette.project_id).select();
  const paletteNameCheck = palettes.filter(palette => palette.name.toUpperCase() === newPalette.name.toUpperCase());
  for (let requiredParams of ['name', 'color1', 'color2', 'color3', 'color4', 'color5',
  'project_id']) {
    if (!newPalette[requiredParams]) {
      return res.status(422).send({
        error: `Required parameter of "${requiredParams}" is missing from request.`
      });
    } else if (paletteNameCheck.length) {
      return res.status(422).send({ error: 'Palette with that name already exists for that project_id' });
    }
  };
  try {
    const validPalette = await database('palettes').insert(newPalette, 'id');
    const { name, color1, color2, color3, color4, color5, project_id } = newPalette;
    res.status(201).json({
      id: validPalette[0],
      name,
      color1,
      color2,
      color3,
      color4,
      color5,
      project_id
    });
  } catch (error) {
    res.status(404).send({
      error: 'No project with that project id exists'
    });
  };
});

app.patch('/api/v1/projects/:id', async (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  let projects = await database('projects').select();
  let projectToBeUpdated = await database('projects').where('id', id).select();
  const projectUpdate = req.body;
  let nameCheck = projects.filter(project => project.name !== projectUpdate.name);
  for (let requiredParam of ['name']) {
    if (!projectToBeUpdated.length) {
      return res.status(404).send({
        error: 'No project with that id exists'
      });
    } else if (!projectUpdate[requiredParam]) {
      return res.status(422).send({
        error: `Required parameter of "${requiredParam}" is missing from request.`
      });
    } else if (nameCheck.length < projects.length) {
      return res.status(422).send({
        error: 'Project with that name already exists'
      });
    };
  };
  try {
    await database('projects').where('id', id).update(projectUpdate);
    const updatedProject = await database('projects').where('id', id).select();
    const { name } = updatedProject[0];
    res.status(200).json({ id, name });
  } catch (error) {
    res.status(500).json({ error });
  };
});

app.patch('/api/v1/palettes/:id', async (req, res) => {
  const { id } = req.body;
  let paletteToBeUpdated = await database('palettes').where('id', id).select();
  if (!id || !paletteToBeUpdated) {
    res.status(404).send({
      error: 'No palette with that id exists'
    });
  }
});

export default app;