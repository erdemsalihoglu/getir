import { afterAll, beforeAll } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo = new MongoMemoryServer();

beforeAll(async () => {
  const mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
});


afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
