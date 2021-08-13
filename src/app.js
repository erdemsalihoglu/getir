import express from "express";
import { keysRouter } from "./routes/keys.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(keysRouter);

app.all("*", (req, res) => {
  res.status(404).send({ code: 404, msg: "Not found!" });
});

export { app };

// TODO: After k8s integration, remove host/port/credential info from codeebase.

/* 
 * TODO: Can move string literals returned at msg filed to a constants file.
 * Or maybe better specific error handler classes can be defined for each error type which knows its error message.
 */
