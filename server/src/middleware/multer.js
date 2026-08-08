import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {

    const allowed = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/gif",

      "audio/webm",
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",

      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",

      "text/plain",

      "application/zip",
      "application/x-zip-compressed",
      "application/x-rar-compressed",

      "text/csv",

      "application/json",

      "application/vnd.android.package-archive",

      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

export default upload;