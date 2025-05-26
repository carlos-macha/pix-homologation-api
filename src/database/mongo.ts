import mongoose from 'mongoose';
import { getEnvVar } from '../utils/environmentVariableHandling';

export async function connectMongo() {
    try {
        await mongoose.connect(getEnvVar("MONGO_URI"),);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};