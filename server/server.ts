import express from "express";
import cors from "cors";
import router from "./routes/route.ts";
import { errorMiddleware } from "./middlewares/errorMiddleware.ts";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "BookingHotel API is running",
  });
});

app.use("/api", router);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});