import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' })
mongoose.set('strictPopulate', false);
import setGlobals from '../backend/core/server/helpers/setGlobals.js';

setGlobals('workers');