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
    res.status(500).json({ error });
  };
});

app.get('/api/v1/palettes', async (req, res) => {
  const { color } = req.query;
  if (color) {
    try {
      let queriedColor = await database('palettes').where('color1', `#${color}`)
        .orWhere('color2', `#${color}`)
        .orWhere('color3', `#${color}`)
        .orWhere('color4', `#${color}`)
        .orWhere('color5', `#${color}`)
        .select();
      queriedColor = queriedColor.map(palette => {
        const { id, name, color1, color2, color3, color4, color5, project_id } = palette;
        return { id, name, color1, color2, color3, color4, color5, project_id };
      })
      return res.status(200).json(queriedColor)
    } catch (error) {
      res.status(500).json({ error })
    } 
  }
  try {
    const palettes = await database('palettes').select();
    res.status(200).json(palettes);
  } catch (error) {
    res.status(500).json({ error });
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
  let { id } = req.params;
  id = parseInt(id);
  const paletteUpdate = req.body;
  let palettes = await database('palettes').select();
  let paletteToBeUpdated = await database('palettes').where('id', id).select();
  let nameCheck = paletteUpdate.name ? palettes.filter(palette => palette.name === paletteUpdate.name && palette.id !== paletteUpdate.id) : null;
  // let checkIfSamePaletteId = nameCheck
  let nameCheckInProject = nameCheck ? nameCheck.filter(palette => palette.project_id === paletteToBeUpdated[0].project_id) : [];
  if (!id || !paletteToBeUpdated[0]) {
    return res.status(404).send({
      error: 'No palette with that id exists'
    });
  } else if (nameCheckInProject.length) {
    return res.status(422).send({
      error: 'Palette with that name already exists under that project id'
    });
  };
  try {
    await database('palettes').where('id', id).update(paletteUpdate);
    const updatedPalette = await database('palettes').where('id', id).select();
    const { name, color1, color2, color3, color4, color5, project_id } = updatedPalette[0];
    res.status(200).json({ id, name, color1, color2, color3, color4, color5, project_id });
  } catch (error) {
    res.status(500).json({ error });
  };
});

app.delete('/api/v1/projects/:id', async (req, res) => {
  let { id } = req.params;
  let foundProject = await database('projects').where('id', id).select();
  id = parseInt(id);
  if (!id || !foundProject.length) {
    return res.status(404).send({
      error: `No project with id: ${id} exists. It has either already been deleted or the id sent with request is incorrect.`
    });
  }
  try {
    await database('palettes').where('project_id', id).del();
    await database('projects').where('id', id).del();
    res.status(200).send({ id: id });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.delete('/api/v1/palettes/:id', async (req, res) => {
  let {
    id
  } = req.params;
  let foundPalette = await database('palettes').where('id', id).select();
  id = parseInt(id);
  if (!id || !foundPalette.length) {
    return res.status(404).send({
      error: `No palette with id: ${id} exists. It has either already been deleted or the id sent with request is incorrect.`
    });
  }
  try {
    await database('palettes').where('id', id).del();
    res.status(200).send({
      id: id
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

export default app;