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
      console.log(projPalette);
      acc.push({ id, name, palettes: projPalette });
      return acc;
    }, []);
    console.log(projsWithPalettes);
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

export default app;