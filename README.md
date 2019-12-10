# Palette Picker BE

Built by:
[Chris Basham](https://github.com/chrisdbasham317)
[Amy Rippeto](https://github.com/aripp2) 

As a student in the Front-End Engineering Program at Turing school of software and design, this was my first project working in the back-end. This was an opportunity to become familiar with building a database with **Express**, **Knex** and **PostgreSQL** and a well documented **RESTfulAPI**. The focus was on working with a one-to-many relational database schema design as well as using appropriate status codes and error handling.

I created the seed dataset for Breweries, giving each of them an array of relevant beers. This allowed me to implement two seperate tables, related by the brewery id.

### [Deployed on Heroku](https://byob-brews.herokuapp.com/)

### [Sprint Project Board](https://github.com/aripp2/BYOB/projects/1)

### Endpoints

| Purpose | URL | Verb | Request Body | Sample Success Response |
|----|----|----|----|----|
| Get all projects | `/api/v1/projects` | GET | none | Array of Projects `[{"id": 1, "name": "Amy's Colors", "palettes": [Array of Palettes]}, ...]`|
| Get all palettes | `/api/v1/palettes` | GET | none | `[{"id":1, "name":"Purples and greens", "color1":"#82d173", "color2":"#abfaa9", "color3":"#95a3b3", "color4":"#4c2c69", "color5":"#42253b", "project_id":1, "created_at":"2019-12-04T01:38:26.059Z", "updated_at":"2019-12-04T01:38:26.059Z"}, ...]` |
| Search for Palettes that contain a color | `/api/v1/palettes?color=f694c1` | GET | none | `[{"id":2, "name":"Pastels", "color1":"#d3f8e2", "color2":"#e4c1f9", "color3":"#f694c1", "color4":"#ede7b1", "color5":"#a9def9", "project_id":1}]` |
| Get all beers for a given brewery | `/api/v1/beers/:brewery_id` `:brewery_id` should be replaced with integer `id` of selected brewery | GET | none | `{[array of beers]}` |
| Add a brewery | `/api/v1/breweries` | POST | Requires: `name(string), year_est(integer), num_locations(integer)` | Status Code 201 & `{ id: added_brewery_id }` |
| Add a beer | `/api/v1/beers` | POST | Requires: `beer(string), style(string), abv(integer), ibu(integer), brewery_id(integer)` | 201 Status Code & `{ id: added_beer_id }` |
| Delete a beer | `/api/v1/beers/:id` `:id` should be replaced with integer `id` of selected beer | DELETE | none | 202 Status Code & `{ message: 'Successfully deleted the beer.'}` |
| Delete a brewery and all of its beers | `/api/v1/breweries/:id` `:id` should be replaced with integer `id` of selected brewery | DELETE | none | 202 Status Code & `{ message: 'Successfully deleted brewery and its beers.'}` |


## Cheers!
