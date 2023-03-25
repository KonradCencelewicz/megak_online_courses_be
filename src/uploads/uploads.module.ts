import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { TypeOrmModule } from "@nestjs/typeorm";

import { Courses } from "../courses/entity/courses.entity";

@Module({
  providers: [UploadsService],
  controllers: [UploadsController],
  imports: [TypeOrmModule.forFeature([Courses])],

})
export class UploadsModule {}
