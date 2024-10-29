const http = require('http');
const routes = require('./routes/routes'); // Import routes dari file routes.js

const server = http.createServer((req, res) => {
    const { method, url } = req;

    // Menemukan route yang sesuai
    const route = routes.find(
        (routeItem) => routeItem.method === method && routeItem.path === url
    );

    if (route) {
        route.handler(req, res); // Panggil handler sesuai route
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const port = 9000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
