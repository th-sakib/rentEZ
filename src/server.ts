import app from "./app";
import { config } from "./config";
import { initDB, pool } from "./config/db";

const port = config.port;

const startServer = async () => {
  try {
    await initDB();

    app.listen(port, () => {
      console.log(`server is running at port: ${port}`);
    });
  } catch (error: any) {
    console.error(error.message, error);
  }
};
startServer();
