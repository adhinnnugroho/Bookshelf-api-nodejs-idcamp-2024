const { parse } = require('url');
const { StringDecoder } = require('string_decoder');
const { nanoid } = require('nanoid');

// Simpan data buku dalam array
const books = [];

// Handler untuk menambah buku
const addBookHandler = (req, res) => {
    let body = '';
    const decoder = new StringDecoder('utf-8');
    req.on('data', (chunk) => {
        body += decoder.write(chunk);
    });

    req.on('end', () => {
        body += decoder.end();
        const { name, year, author, summary, publisher, pageCount, readPage, reading } = JSON.parse(body);

        if (!name) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            }));
        }

        if (readPage > pageCount) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            }));
        }

        const id = nanoid(16);
        const finished = pageCount === readPage;
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const newBook = {
            id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
        };

        books.push(newBook);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }));
    });
};

// Handler untuk mendapatkan semua buku
const getAllBooksHandler = (req, res) => {
    const bookSummaries = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: 'success',
        data: {
            books: bookSummaries,
        },
    }));
};

// Handler untuk mendapatkan buku berdasarkan ID
const getBookByIdHandler = (req, res) => {
    const { pathname } = parse(req.url, true);
    const bookId = pathname.split('/')[2];
    const book = books.find((b) => b.id === bookId);

    if (!book) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: 'success',
        data: {
            book,
        },
    }));
};

// Handler untuk mengedit buku berdasarkan ID
const editBookByIdHandler = (req, res) => {
    const { pathname } = parse(req.url, true);
    const bookId = pathname.split('/')[2];
    const bookIndex = books.findIndex((b) => b.id === bookId);

    if (bookIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }));
    }

    let body = '';
    const decoder = new StringDecoder('utf-8');
    req.on('data', (chunk) => {
        body += decoder.write(chunk);
    });

    req.on('end', () => {
        body += decoder.end();
        const { name, year, author, summary, publisher, pageCount, readPage, reading } = JSON.parse(body);

        if (!name) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            }));
        }

        if (readPage > pageCount) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            }));
        }

        const updatedAt = new Date().toISOString();
        books[bookIndex] = {
            ...books[bookIndex],
            name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        }));
    });
};

// Handler untuk menghapus buku berdasarkan ID
const deleteBookByIdHandler = (req, res) => {
    const { pathname } = parse(req.url, true);
    const bookId = pathname.split('/')[2];
    const bookIndex = books.findIndex((b) => b.id === bookId);

    if (bookIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }));
    }

    books.splice(bookIndex, 1);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: 'success',
        message: 'Buku berhasil dihapus',
    }));
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
