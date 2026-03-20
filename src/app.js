import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import authRouter from "../src/routes/auth/auth.routes.js"
import profileRouter from "../src/routes/profile/profile.routes.js"
import messageRouter from "./routes/messaging/message.routes.js"
import weatherRouter from "../src/routes/weather/weather.routes.js"
import locationRouter from "../src/routes/location/loaction.routes.js"
import travelAiRouter from "../src/routes/travelAi/travelAi.routes.js"
import tripRouter from "../src/routes/trip/trip.routes.js"
import notificationRoutes from "../src/routes/notification/notification.routes.js";




const app=express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname,"../public")))



app.use("/api/auth",authRouter)
app.use("/api/profile",profileRouter)
app.use("/api/message",messageRouter)
app.use("/api/weather",weatherRouter)
app.use("/api/location",locationRouter)
app.use("/api/travelAi",travelAiRouter)
app.use("/api/trips",tripRouter)
app.use("/api/notification", notificationRoutes);






export {app}