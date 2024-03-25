const express = require('express');
const fileUpload = require('express-fileupload');
const router = require('./routers/FileUpload');
const { dbConnect } = require('./config/database');
const { cloudinaryConnect } = require('./config/cloudinary');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT  || 3000;

app.use(express.json());

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
    createParentPath: true,
}));

app.use('/api/v1', router);

app.listen(PORT, ()=> {
    console.log(`Server is running at port ${PORT}`);
})

dbConnect();
cloudinaryConnect();