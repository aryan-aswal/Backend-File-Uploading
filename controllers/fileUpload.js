const File = require('../models/File');
const path = require('path');
const cloudinary = require('cloudinary').v2

const localFileUpload = async(req, res) => {
    try {
        // fetch file from request
        const file = req.files.file;
        console.log(file);
        // Storing file in a specified path
        let filePath = path.join(__dirname, '/files/') + Date.now() + `.${file.name.split(".")[1]}`;

        file.mv(filePath, (error) => {
            if(error) {
                console.log(error);
            } else {
                res.status(200).json({
                    success: true,
                    message: "Local File Uploaded"
                })
            }
        })

    } catch (error) {
        console.log(error.message);
    }
}

const uploadFileToCloudinary = async(file, folder, quality) => {
    console.log(file);

    const options = {
        folder: folder,
        resource_type: 'auto',
        // use_filename: true,
        public_id: file.name,
    }

    if(quality) {
        options.quality = quality
    }

    return await cloudinary.uploader.upload(file.tempFilePath, options);
} 
const imageUpload = async(req, res) => {
    try {
        const file = req.files.image;
        const { name, tags, email } = req.body;

        const supportedFormat = ['jpeg', 'jpg', 'png'];

        const fileType = file.name.split(".")[1].toLowerCase();

        if(!supportedFormat.includes(fileType)) {
            res.status(400).json({
                success: false,
                message: "Unsupported file format"
            })
        }

        const maxSize = 20 * 1024 * 1024;
        if(maxSize < file.size) {
            res.status(413).json({
                success: false,
                message: "File size is greater than 20mb"
            })
        }

        const response = await uploadFileToCloudinary(file, "File Handling");

        const entry = await File.create({
            name,
            tags,
            email,
            imgUrl: response.secure_url
        })

        res.status(200).json({
            success: true,
            entry: entry,
            message: "file uploaded successfully"
        })
     } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const videoUpload = async(req, res) => {
    try {
        const file = req.files.video;
        const { name, tags, email } = req.body;

        console.log(file);
        const supportedFormat = ['mp4', 'mov'];
        const fileType = file.name.split(".")[1].toLowerCase();

        if(!supportedFormat.includes(fileType)) {
            res.status(400).json({
                success: false,
                message: "file format not supported"
            })
        }

        const response = await uploadFileToCloudinary(file, "File Handling");

        const entry = await File.create({
            name,
            tags,
            email,
            imgUrl: response.secure_url
        })

        res.status(200).json({
            success: true,
            entry: entry,
            message: "file uploaded successfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}
const imageSizeReducer = async(req, res) => {
    try {
        const { name, tags, email } = req.body;
        const file = req.files.image;

        const supportedFormat = ['jpeg', 'jpg', 'png'];
        const fileType = file.name.split(".")[1];

        if(!supportedFormat.includes(fileType)) {
            res.status(400).json({
                success: false,
                message: "file format not supported"
            })
        } 

        const response = await uploadFileToCloudinary(file, "File Handling", 50);

        const entry = await File.create({
            name,
            tags,
            email,
            imgUrl: response.secure_url
        })

        res.status(200).json({
            success: true,
            entry: entry,
            message: "file uploaded successfully"
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}
module.exports = { localFileUpload, imageUpload, videoUpload, imageSizeReducer }