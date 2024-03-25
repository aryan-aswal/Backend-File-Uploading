const mongoose = require('mongoose');
const transporter = require('../config/transporter');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        required: true,
    },
    tags: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
})

schema.post('save', async(doc) => {
    try {
        let info = await transporter.sendMail({
            from: "File Handling Project",
            to: doc.email,
            subject: "New file uploaded",
            html: `<h3>Hope you are well, File Uploaded successfully</h3> { <br/> <p>Name: ${doc.name} <br/> Tags: ${doc.tags} <br/> File Url: ${doc.imgUrl} <br/> }</p>`
        })
        console.log(info);
    } catch (error) {
        console.error(error);
        console.log(error.message);
    }
})
module.exports = mongoose.model("File", schema);