const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  console.log('Request received');
  res.json({ message: 'Test OK' });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = 5000;
const server = app.listen(PORT, () => {
  console.log(`Test server on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
