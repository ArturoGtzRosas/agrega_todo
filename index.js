//Importamos las librarías requeridas
const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();

//Documentación en https://expressjs.com/en/starter/hello-world.html
const app = express()

//Creamos un parser de tipo application/json
//Documentación en https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json()


// Abre la base de datos de SQLite
const db = new sqlite3.Database('./base.sqlite3', (err) => {
    if (err) {
        console.error(err.message);
        return;        
    }
    console.log('Conectado a la base de datos SQLite.');

    // (e) Crea una tabla "todos" en SQLite (id, todo, created_at).
    // Esta parte ya estaba correcta en tu código original.
    db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        todo TEXT NOT NULL,
        created_at INTEGER
    )`, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Tabla "todos" creada o ya existente.');
        }
    });
});

// (d) Crea un endpoint "agrega_todo" que reciba datos con POST.
app.post('/agrega_todo', jsonParser, function (req, res) {
    const { todo } = req.body;
   
    console.log('Dato recibido:', todo);
    res.setHeader('Content-Type', 'application/json');
    
    // Verificamos que el campo 'todo' venga en el body
    if (!todo) {
        res.status(400).json({ error: 'El campo "todo" es requerido.' });
        return;
    }

    // (f) Modificamos el endpoint para guardar los datos en la tabla.
    const sql = 'INSERT INTO todos (todo, created_at) VALUES (?, CURRENT_TIMESTAMP)';

  
    db.run(sql, [todo], function(err) {
        if (err) {
          console.error("Error al insertar en la base de datos:", err.message);
          res.status(500).json({ error: err.message });
          return;
        } 
        
       
        console.log(`Se ha insertado la fila con ID: ${this.lastID}`);
        res.status(201).json({
            id: this.lastID,
            todo: todo
        });
    });

    
});


app.get('/', function (req, res) {
    //Enviamos de regreso la respuesta
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 'status': 'ok' }));
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});