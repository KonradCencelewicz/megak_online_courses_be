import { Controller, InternalServerErrorException, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as fs from "fs";

@Controller('uploads')
export class UploadsController {
  @Post('courses')
  @UseInterceptors(FileInterceptor('courseImg'))
  async uploadCourseFile(
    @UploadedFile() courseImg
  ) {
    try {
      fs.writeFileSync(`${process.env.UPLOAD_TEMP_DIR}/${courseImg.originalname}`, courseImg.buffer);
      return {
        status: 'success',
        message: "File uploaded successfully"
      }
    } catch (error) {
      throw new InternalServerErrorException({
        status: 'failed',
        message: error.message
      });
    }
  }
}
