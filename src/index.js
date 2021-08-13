import mongoose from "mongoose";

import { app } from "./app.js";
import { uris } from "./config/uris.js";

const start = async () => {
  try {
    await mongoose.connect(uris.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Connected to mongo db.");

    app.listen(3000, () => {
      console.log("started to listen at 3000.");
    });

  } catch (error) {
    console.log(error);
  }
};

start();
