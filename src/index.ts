import  express  from "express";
import errorHandler from "./middlewares/errorHandler";
import authRouter from "./routes/authRoute";
import paymentRouter from "./routes/paymentRoute";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);

app.use("/payment", paymentRouter);

app.use(errorHandler);

export default app;