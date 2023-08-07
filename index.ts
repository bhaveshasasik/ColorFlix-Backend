import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './server';

dotenv.config();

const PORT: string = process.env.PORT;
const URI: string = process.env.CANVAS_DB_URI || '';
mongoose.set('strictQuery', true);
mongoose
    .connect(URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(`cannot connected, error happened: ${err}`);
    });
