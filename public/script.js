const form = document.getElementById('libroForm');
const listaLibros = document.getElementById('listaLibros');

async function cargarLibros() {
    const response = await fetch('/api/libros'); 
    const libros = await response.json();
    listaLibros.innerHTML = '';
    
    libros.forEach(libro => {
        const li = document.createElement('li');
        li.id = `libro-${libro.id}`;
        
        li.innerHTML = `
            <div class="libro-info">
                <span class="libro-titulo">${libro.titulo}</span>
                <span class="libro-autor">${libro.autor}</span>
            </div>
            <div class="acciones">
                <button class="btn-secondary" onclick="activarEdicion(${libro.id}, '${libro.titulo.replace(/'/g, "\\'")}', '${libro.autor.replace(/'/g, "\\'")}')">Editar</button>
                <button class="btn-danger" onclick="eliminarLibro(${libro.id})">Eliminar</button>
            </div>
        `;
        listaLibros.appendChild(li);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;

    await fetch('/api/libros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autor })
    });

    form.reset();
    cargarLibros();
});

async function eliminarLibro(id) {
    await fetch(`/api/libros/${id}`, { method: 'DELETE' });
    cargarLibros();
}

function activarEdicion(id, tituloActual, autorActual) {
    const li = document.getElementById(`libro-${id}`);
    
    li.innerHTML = `
        <div class="edit-mode">
            <div class="edit-inputs">
                <input type="text" id="edit-titulo-${id}" value="${tituloActual}">
                <input type="text" id="edit-autor-${id}" value="${autorActual}">
            </div>
            <div class="acciones">
                <button class="btn-primary" onclick="guardarEdicion(${id})">Guardar</button>
                <button class="btn-secondary" onclick="cargarLibros()">Cancelar</button>
            </div>
        </div>
    `;
}

async function guardarEdicion(id) {
    const titulo = document.getElementById(`edit-titulo-${id}`).value;
    const autor = document.getElementById(`edit-autor-${id}`).value;

    await fetch(`/api/libros/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autor })
    });
    
    cargarLibros();
}

cargarLibros();