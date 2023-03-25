import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { Request } from "express";
import { HttpException, HttpStatus } from "@nestjs/common";
import { diskStorage } from "multer";
import * as fs from "fs";

export const multerOptionConfig: MulterOptions = {
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE || 1024 * 1024 * 5,
  },
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    done: (error: Error, acceptFile: boolean) => void,
  ) {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      done(null, true);
    } else {
      done(
        new HttpException(
          'Unsupported file type',
          HttpStatus.BAD_REQUEST
        ),
        false
      );
    }
  },
  storage: diskStorage({
    destination(Request: Request, file: Express.Multer.File, done: (error: (Error | null), filename: string) => void) {
      const uploadPath = process.env.UPLOAD_TEMP_DIR;
      if(!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }

      done(null, process.env.UPLOAD_PATH);
    },
    filename(req: Request, file: Express.Multer.File, done: (error: (Error | null), filename: string) => void) {
      const fileName = `${Date.now()}-${file.originalname}`;
      done(null, fileName)
    }
  }),
};
