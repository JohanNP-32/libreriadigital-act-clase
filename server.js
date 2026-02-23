const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

//Base de datos (en memoria)
let libros = [
{ id: 1, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez' },
{ id: 2, titulo: '1984', autor: 'George Orwell' },
{ id: 3, titulo: 'El principito', autor: 'Antoine de Saint-Exupéry' }
];

//Operacion GET: obtener todos los libros
app.get('/api/libros', (req, res) => {
res.json(libros);
});

//OPERACION POST
app.post('/api/libros', (req, res) => {
const nuevoLibro = {
id: libros.length > 0 ? libros[libros.length - 1].id + 1 : 1,
titulo: req.body.titulo,
autor: req.body.autor
};
libros.push(nuevoLibro);
res.status(201).json(nuevoLibro);
});

//OPERACION PUT
app.put('/api/libros/:id', (req, res) => {
const libroId = parseInt(req.params.id);
const libro = libros.find(b => b.id === libroId);

if (libro) {
    libro.titulo = req.body.titulo || libro.titulo;
    libro.autor = req.body.autor || libro.autor;
    res.json(libro);
} else {
    res.status(404).json({ message: 'Libro no encontrado' });
}
});

//DELETE
app.delete('/api/libros/:id', (req, res) => {
const libroId = parseInt(req.params.id);
const index = libros.findIndex(b => b.id === libroId);

if (index !== -1) {
    libros.splice(index, 1);
    res.json({ message: 'Libro eliminado' });
} else {
    res.status(404).json({ message: 'Libro no encontrado' });
}
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});