import { multer } from "multer";
//the method takes an object with key-value pairs{destination:value, filename:value}
const storage = multer.diskStorage({
  //this function takes a request, file handled by multer, call back function
  destination: function (req, file, cb) {
    //cb function params: null->"errors", "destination"->path
    cb(null, `./public/images`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1000 * 1000,
  },
});
