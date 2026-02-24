const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();
const PORT = 3000;

//1. Definir el esquema GrapghQL
const typeDefs = gql`
    type Libro {
        id: ID!
        titulo: String!
        autor: String!
    }

    type Query {
        libros: [Libro] #Obtener todos los libros
        libro(id: ID!): Libro #Obtener un libro por su ID
    }

    type Mutation {
    agregarLibro(titulo: String!, autor: String!): Libro #Agregar un nuevo libro
    actualizarLibro(id: ID!, titulo: String, autor: String): Libro #Actualizar un libro existente
    eliminarLibro(id: ID!): Libro #Eliminar un libro por su ID
    }
`;

//BASE DE DATOS en memoria
let libros = [
    { id: 1, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez' },
    { id: 2, titulo: '1984', autor: 'George Orwell' },
    { id: 3, titulo: 'El principito', autor: 'Antoine de Saint-Exupéry' }
    ];


//2. Definir los resolvers
const resolvers = {
    Query: {
        libros: () => libros,
        libro: (parent, args) => libros.find(libro => libro.id === parseInt(args.id))
    },
    Mutation: {
        agregarLibro: (parent, { titulo, autor }) => {
            const nuevoLibro = { id: String(libros.length + 1), titulo, autor };
            libros.push(nuevoLibro);
            return nuevoLibro;
        }
    }
};


//3. Crear el servidor Apollo
async function startServer() {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`Servidor GraphQL escuchando en http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer();