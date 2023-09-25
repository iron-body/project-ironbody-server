const cloudinary = require('cloudinary').v2;

const fs = require('fs');
const path = require('path');



//шлях до локальної папки з гіфками
const folderPath = path.join(__dirname, "../", "cloudinaryPP");

//дані з файлу .env для аутентифікації в cloudinary 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadFileToCloudinary = async (filePath, file) => {
  try {
   //записуються файли у папку exercises зі своїм оригінальним імʼям
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'filters',
        //   public_id: file.slice(0,4),
    public_id: file,
      use_filename: true,
      unique_filename: false,

    });
    console.log(`File ${filePath} uploaded to URL: ${result.url}`);
  } catch (err) {
    console.error(`Failed to upload ${filePath}. Error: ${err.message}`);
  }
};

const onceUploadFilesAndChangeUrl = async (req, res) => {



};

module.exports = {onceUploadFilesAndChangeUrl};