require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const Minio = require("minio");
const multer = require("multer");

const app = express();
const port = 3000; // Port for our Express app

// --- MinIO Client Setup ---
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});
const bucketName = process.env.MINIO_BUCKET;

// --- Multer Setup (for handling file uploads) ---
const upload = multer({ storage: multer.memoryStorage() });

// --- Helper function to ensure bucket exists ---
async function ensureBucketExists() {
  console.log(`Checking if bucket "${bucketName}" exists...`);
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      console.log(`Bucket "${bucketName}" does not exist. Creating...`);
      await minioClient.makeBucket(bucketName);
      console.log(`Bucket "${bucketName}" created successfully.`);
    } else {
      console.log(`Bucket "${bucketName}" already exists.`);
    }
  } catch (err) {
    console.error("Error checking/creating bucket:", err);
    process.exit(1);
  }
}

// --- Routes ---

// Simple HTML form for uploading
app.get("/", (req, res) => {
  res.send(`
    <h1>MinIO Image Upload</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="imagefile" accept="image/*" required>
      <button type="submit">Upload Image</button>
    </form>
    <p>After uploading, view image at /images/your-image-filename.ext</p>
  `);
});

// Handle Image Upload (POST)
app.post("/upload", upload.single("imagefile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const objectName = `${Date.now()}-${req.file.originalname}`;
  const fileBuffer = req.file.buffer;
  const metaData = {
    "Content-Type": req.file.mimetype,
  };

  console.log(
    `Attempting to upload "${objectName}" to bucket "${bucketName}"...`
  );

  try {
    await minioClient.putObject(bucketName, objectName, fileBuffer, metaData);
    console.log(`Successfully uploaded "${objectName}"`);
    const viewUrl = `/images/${objectName}`;
    res
      .status(200)
      .send(
        `File uploaded successfully! <a href="${viewUrl}">View Image: ${objectName}</a>`
      );
  } catch (err) {
    console.error("Error uploading file to MinIO:", err);
    res.status(500).send("Error uploading file.");
  }
});

// Serve Image (GET)
app.get("/images/:objectName", async (req, res) => {
  const objectName = req.params.objectName;
  console.log(
    `Attempting to retrieve "${objectName}" from bucket "${bucketName}"...`
  );

  try {
    const stat = await minioClient.statObject(bucketName, objectName);
    res.setHeader(
      "Content-Type",
      stat.metaData["content-type"] || stat.contentType
    );
    res.setHeader("Content-Length", stat.size);

    const stream = await minioClient.getObject(bucketName, objectName);
    console.log(`Streaming "${objectName}" to client.`);
    stream.pipe(res);

    stream.on("error", (err) => {
      console.error(`Stream error for "${objectName}":`, err);
      if (!res.headersSent) {
        if (err.code === "NoSuchKey") {
          res.status(404).send("Image not found");
        } else {
          res.status(500).send("Error retrieving image");
        }
      } else {
        res.end();
      }
    });
  } catch (err) {
    console.error(`Error retrieving object "${objectName}":`, err);
    if (err.code === "NoSuchKey") {
      res.status(404).send("Image not found");
    } else {
      res.status(500).send("Error retrieving image");
    }
  }
});

// --- Start Server ---
app.listen(port, async () => {
  await ensureBucketExists();
  console.log(`Server listening at http://localhost:${port}`);
  console.log(
    `Using MinIO Endpoint: ${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`
  );
  console.log(`Using MinIO Bucket: ${bucketName}`);
});
