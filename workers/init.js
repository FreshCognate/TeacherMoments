import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' })
mongoose.set('strictPopulate', false);
import setGlobals from './setGlobals.js';

setGlobals('workers');