const {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
} = require('../handlers/handler'); // Import handler dari file handler.js

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',  // Placeholder untuk bookId
        handler: getBookByIdHandler,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',  // Placeholder untuk bookId
        handler: editBookByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',  // Placeholder untuk bookId
        handler: deleteBookByIdHandler,
    },
    {
        method: 'GET',
        path: '/',  // Route untuk home atau menampilkan semua buku
        handler: getAllBooksHandler,
    },
];

module.exports = routes;
