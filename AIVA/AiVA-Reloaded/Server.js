// server.js (Backend)
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

// Middleware
app.use(bodyParser.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Server is working!');
});

// Ollama Route (Model Request)
app.post('/ollama', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post('http://localhost:5001/ollama', { prompt });
        res.json(response.data);
    } catch (error) {
        console.error('Error calling Ollama API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(5000, '0.0.0.0', () => {
    console.log('Server running at http://0.0.0.0:5000');
}).on('error', (err) => {
    console.error('Error starting the server:', err);
});