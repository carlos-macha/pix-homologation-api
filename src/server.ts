import app from './index';
import dotenv from 'dotenv';
import { connectMongo } from './database/mongo';
import { connectPostgres } from './database/postgres';

dotenv.config();

console.log("NODE_ENV:", process.env.NODE_ENV);

const PORT = process.env.PORT || 3000;
connectMongo();
connectPostgres()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
