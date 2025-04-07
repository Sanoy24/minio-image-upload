# 🧺 MinIO Image Upload & Serve App (with Express.js)

This is a simple Express.js application that lets you:

- 📤 Upload images through a web form
- 🗃️ Store uploaded images in a [MinIO](https://min.io/) bucket
- 🌐 Serve uploaded images via a public `/images/:filename` route

integrated MinIO with a Node.js backend using `multer`.

---

## 🚀 Features

- ✅ File upload via browser
- ✅ Image storage in MinIO
- ✅ Public image viewing route
- ✅ Bucket auto-creation if it doesn't exist
- ✅ Basic HTML form interface

---

## 📁 Project Structure

```
.
├── indexjs
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Sanoy24/minio-image-upload.git
cd minio-image-upload
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=YOUR_MINIO_ACCESS_KEY
MINIO_SECRET_KEY=YOUR_MINIO_SECRET_KEY
MINIO_BUCKET=images
```

> Make sure MinIO is running locally or update the values accordingly.

### 4. Start the Server

```bash
node index.js
```

---

## 🌐 How to Use

### Upload an Image

1. Open your browser at [http://localhost:3000](http://localhost:3000)
2. Choose an image and click "Upload"
3. You’ll get a link to view your uploaded image

### View an Uploaded Image

Access it directly at:

```bash
http://localhost:3000/images/<your-filename>
```

---

## 🛠 Tech Stack

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MinIO SDK](https://docs.min.io/docs/javascript-client-quickstart-guide.html)
- [Multer](https://github.com/expressjs/multer)

---

## 🧪 Sample `.env` File

```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=images
```

---
