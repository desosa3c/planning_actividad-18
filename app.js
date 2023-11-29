const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const mariaDB = require('mariadb');

const app = express();
app.set('port', 1300);
app.use(cors())
app.use(bodyParser.json());

const pool = mariaDB.createPool({
    host: 'localhost',
    port: '3306',
    database: 'planning',
    user: 'root',
    password: '1234',
    connectionLimit: 5
});

let conn

async function getConnection() {
    conn = await pool.getConnection();
    console.log('CONEXION ESTABLECIDA')
}

getConnection()

app.get('/tasks', async (req, res) => {
    const tasks = await conn.query("SELECT * from todo");
    res.json(tasks)
})


app.post('/tasks', async (req, res) => {
    try {
        console.log(req);
        const task = req.body;
        console.log(task);
        const tasks = await conn.query(`INSERT INTO todo (name, description, created_at, update_at, status) VALUES ('${task.name}', '${task.description}', NOW(), NOW(), '${task.status}')`);
        if (tasks.affectedRows > 0) {
            res.json('ok')
        } else {
            res.json('Error al insertar una tarea')
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
});


app.delete('/tasks/:id', async (req, res) => {
    try {
        const taskID = req.params.id;
        const result = await conn.query(`DELETE FROM todo WHERE id= '${taskID}'`)

        if (result.affectedRows > 0) {
            res.json('Tarea eliminada.');
        } else {
            res.status(404).json('Tarea no encontrada');
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

app.put('/tasks/:id', async (req, res) => {

    try {
        const taskID = req.params.id;
        const updateTask = req.body;

        const result = await conn.query(
            `UPDATE todo SET name = '${updateTask.name}', description = '${updateTask.description}',update_at = NOW(), status = '${updateTask.status}' WHERE id = '${taskID}'`
        );

        if (result.affectedRows > 0) {
            res.json('Tarea actualizada.');
        } else {
            res.status(404).json('Tarea no encontrada.')
        }
    } catch (error) {
        res.status(500).json(error);
    }
})


app.listen(app.get('port'), () => {
    console.log('Listening on port', app.get('port'));
});