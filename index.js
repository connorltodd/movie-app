const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const connection = require('./conf');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// Route 1 get movie by id via request.params /api/movies/:id
app.get('/api/movies/:id', (request, response) => {
    const id = request.params.id;

    connection.query('SELECT * FROM movie WHERE id = ?', [id], (err, results) => {
        if (err) {
            response.status(500).send('Internal Server Error')
        } else {
            if (!results.length) {
                response.status(404).send(`Movie with the id ${id} does not exist`)
            } else {
                response.json(results)
            }
        }
    })
})

// Route 2 get movies filtered by request.query /api/movies?rating=3&Genre=Comedy
app.get('/api/movies', (request, response) => {
    const query = request.query;
    let sql = 'SELECT * FROM movie WHERE ';
    let sqlValues = [];

    Object.keys(query).map((key, index) => {
        if (index === Object.keys(query).length - 1) {
            sql += `${key} = ?`
        } else {
            sql += `${key} = ? AND `
        }
        sqlValues.push(query[key])
    })

    connection.query(sql, sqlValues, (err, results) => {
        if (err) {
            response.status(500).send('Internal server error')
        } else {
            if (!results.length) {
                response.status(404).send('The movie you have searched does not exist')
            } else {
                response.json(results)
            }
        }
    })
})


app.listen(port, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`The app is running at ${port}`)
    }
})

