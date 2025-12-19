import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//this fetches the file from path and uploads it to cloudinary cloud

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    //if there is no path return null
    if (!localFilePath) return null;
    //upload image
    const uploadResult = await cloudinary.uploader.upload(
      //resource type auto means we dont know if its a image video and we tell cloudinary to figure it out
      localFilePath,
      {
        resource_type: "auto",
      }
    );
    //console.log("file is uploaded on cloudinary", uploadResult.url);

    //once the file is uploaded successfully remove it from local disk
    fs.unlinkSync(localFilePath);
    //Cloudinary returns an object (uploadResult) containing the new public URL, size, format, etc
    return uploadResult;
  } catch (error) {
    //remove the locally saved temporary file as operation failed
    console.log("ERROR:", error);
    if (localFilePath) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

export { uploadOnCloudinary };

/*
    flow diagram

    [User] 
  ⬇️ (Uploads file)
[Server using Multer] 
  ⬇️ (Saves file locally to 'public/temp/image.png')
[Call uploadOnCloudinary function]
  ⬇️
  ❓ Is the file path valid? -> No -> Stop.
  ⬇️ Yes
  ☁️ Upload file to Cloudinary... (WAITING)
  ⬇️
  Did it work?
  ├── ✅ YES: 
  │     1. Get URL from Cloudinary.
  │     2. DELETE 'public/temp/image.png' (Clean up).
  │     3. Return URL to controller.
  │
  └── ❌ NO: 
        1. Catch error.
        2. DELETE 'public/temp/image.png' (Clean up).
        3. Return null.

    */
