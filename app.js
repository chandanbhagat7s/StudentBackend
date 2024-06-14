
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const env = require("dotenv");
const compression = require('compression');



const globalErrorHandler = require('./utils/globalErrorHandler');
const userRouter = require('./Routes/userRoutes');
const adminRouter = require('./Routes/adminRoutes');
const teacherRoute = require('./Routes/teacherRoutes');
const appError = require('./utils/appError');




const cloudinary = require('cloudinary');
const app = express()
env.config({ path: "./config.env" })




app.use(morgan("dev"))
app.use(compression())

const PORT = process.env.PORT || 3000;
console.log(PORT);

app.use(express.json())


mongoose.connect(process.env.DATABASE_URL, {

})
    .then((con) => {
        console.log("database connected");
    }).catch(e => {
        console.log("not connected");
    })


//  for uploading files
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


// app.use("/", (req, res) => { res.status(200).send({ status: "working" }) })
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


