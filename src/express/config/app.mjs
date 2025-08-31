import express from 'express';
import conectaDB from './db.mjs';

const app = express();
conectaDB();
app.use(express.json({limit: '10mb'}));

app.use((error, req, res, next) => {
    console.error(error.message);
    res.status(error.status || 500).json({message: error.message})
});

export default app;
