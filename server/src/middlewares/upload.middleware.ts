import multer, { type StorageEngine } from "multer";
import { type Request } from "express";

// Allowed MIME types
const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",

  // Videos
  "video/mp4",
  "video/mpeg",
  "video/quicktime", // .mov
];

const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, "./public/temp");
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and videos are allowed."));
  }
};

const limits = {
  fileSize: 50 * 1024 * 1024, // 50MB
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});

// todo - add file filter and validation
