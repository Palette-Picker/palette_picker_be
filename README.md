# Palette Picker BE

Built by:
[Chris Basham](https://github.com/chrisdbasham317)
[Amy Rippeto](https://github.com/aripp2) 

As students in the Front-End Engineering Program at Turing school of Software and Design, we were tasked with creating a RESTful API and database to use with a frontend application. Palette Picker was inspired by the well known [Coolors](https://coolors.co/393d3f-fdfdff-c6c5b9-62929e-546a7b) site. The project was accomplished with heavy emphasis on remote work, and clear, concise, efficient communication. We set out to create an thoroughly tested, and attractive application with a pleasing UI/UX.

### [Front End Repo](https://github.com/Palette-Picker/palette_picker_fe)
### [Live Application](https://palette-picker-1906-fe.herokuapp.com)

### Tech Stack/Tools
- Node.js
- Express.js
- Knex.js
- React
- Router
- PostreSQL
- TravisCI
- Jest/Supertest
- GitHub Projects

### [Deployed on Heroku](https://palette-picker-1906-be.herokuapp.com)

### [Project Board](https://github.com/orgs/Palette-Picker/projects/1)

### [Schema](https://drive.google.com/file/d/1iK_xxviYD17hg0083pTU-cP2GBWR6ZIH/view?usp=sharing)

### Setup
1. Clone down this repo & `cd` in to the directory `palette_picker_be`
2. Install dependencies `npm install`
3. In PostgreSQL create a database
```
CREATE DATABASE projects;
\c projects
```
4. Migrate/Seed Data
```
knex migrate:latest
knex seed:run
knex migrate:latest --env test
knex seed:run --env test
```
5. Start the server `npm start`
6. When server is running go to [http://localhost:3000](http://localhost:3000) to use the enpoints below.

### Endpoints

| Purpose | URL | Verb | Request Body | Sample Success Response |
|----|----|----|----|----|
| Get all projects | `/api/v1/projects` | GET | none | Array of projects: `[{"id": 1, "name": "Colors", "palettes": [Array of Palettes]}]`|
| Get all palettes | `/api/v1/palettes` | GET | none | Array of palettes: `[{"id":1, "name":"Purples and greens", "color1":"#82d173", "color2":"#abfaa9", "color3":"#95a3b3", "color4":"#4c2c69", "color5":"#42253b", "project_id":1, "created_at":"2019-12-04T01:38:26.059Z", "updated_at":"2019-12-04T01:38:26.059Z"}, ...]` |
| Search for palettes that contain a color | `/api/v1/palettes?color=f694c1` | GET | none | Array of palettes: `[{"id":2, "name":"Pastels", "color1":"#d3f8e2", "color2":"#e4c1f9", "color3":"#f694c1", "color4":"#ede7b1", "color5":"#a9def9", "project_id":1}]` |
| Get a specific project by id | `/api/v1/projects/:id` `:id` should be replaced with integer `id` of selected project | GET | none | `{ "id": 21, "name": "Colors", "created_at": "2019-12-10T19:42:34.142Z", "updated_at": "2019-12-10T19:42:34.142Z"}` |
| Get a specific palette by id | `/api/v1/projects/:id` `:id` should be replaced with integer `id` of selected palette | GET | none | `{"id": 36, "name": "Greens", "color1": "#5c6f68", "color2": "#8aa39b", "color3": "#95d9c3", "color4": "#a4f9c8", "color5": "#a7fff6", "project_id": 22, "created_at": "2019-12-10T19:42:34.260Z", "updated_at": "2019-12-10T19:42:34.260Z"}` |
| Add a project | `/api/v1/projects` | POST | Requires: `name(string)` Note: name must be unique | Status Code 201 & `{ "id": 23, "name":"New Project"}` |
| Add a palette | `/api/v1/palette` | POST | Requires: `name(string), color1(string), color2(string), color3(string), color4(string), color5(string), project_id(integer)` Note: the string for each color needs to be in a valid hex code format `#fff123` and the name must be unique | 201 Status Code & `{"id": 37, "name": "New Palette", "color1": "#ffffff", "color2": "#000000", "color3": "#31487a", "color4": "#317a36", "color5": "#7a3170", "project_id": 22}` |
| Edit a project | `/api/v1/projects/:id` `:id` should be replaced with integer `id` of selected project | PATCH | Requires: `name(string)` Note: name must be unique | Status Code 200 & `{ "id": 23, "name":"Edited Project"}` |
| Edit a palette | `/api/v1/palettes/:id` `:id` should be replaced with integer `id` of selected palette | PATCH | One or all of the following to be changed/updated: `name(string), color1(string), color2(string), color3(string), color4(string), color5(string), project_id(integer)` Note: the string for each color needs to be in a valid hex code format `#fff123` and the name must be unique| Status Code 200 & `{"id": 33, "name": "Edited Palette", "color1": "#82d173", "color2": "#abfaa9", "color3": "#95a3b3", "color4": "#4c2c69", "color5": "#42253b", "project_id": 21}`|
| Delete a palette | `/api/v1/palettes/:id` `:id` should be replaced with integer `id` of selected palette | DELETE | none | 200 Status Code & `{"id": 37}` |
| Delete a project and all of its palettes | `/api/v1/projects/:id` `:id` should be replaced with integer `id` of selected project | DELETE | none | 200 Status Code & `{"id": 23}` |


