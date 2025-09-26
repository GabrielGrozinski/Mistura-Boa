import express from 'express';
import conectaDB from './db.mjs';
import userRoutes from '../routes/userRoutes.mjs';

const app = express();
conectaDB();
app.use(express.json({limit: '10mb'}));

app.use('/usuarios', userRoutes);

app.use((error, req, res, next) => {
    console.error(error.message);
    res.status(error.status || 500).json({message: error.message})
});

export default app;
