
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const env = require("dotenv");
const globalErrorHandler = require('./utils/globalErrorHandler');
const userRouter = require('./Routes/userRoutes');
const adminRouter = require('./Routes/adminRoutes');
const teacherRoute = require('./Routes/teacherRoutes');
const appError = require('./utils/appError');

const app = express()
env.config({ path: "./config.env" })

app.use(morgan("dev"))

const PORT = process.env.PORT || 3000;
console.log(PORT);

app.use(express.json())


mongoose.connect(process.env.DATABASE_URL, {

})
    .then((con) => {
        console.log("database connected");
    }).catch(e => {
        console.log("not connected", e);
    })



app.use('/api/v1/auth', userRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/teacher", teacherRoute)

app.all("*", (req, res, next) => {
    return next(new appError("requested url not found please try to hit valid url", 400))
})

app.use(globalErrorHandler)


app.listen(PORT, () => {
    console.log("server started at port ", PORT);
})


