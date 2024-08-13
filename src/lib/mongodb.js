// src/lib/mongodb.js

import mongoose from 'mongoose';

const connectMongoDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise(); // already connected
  }

  return mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectMongoDB;
