import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import databaseConfiguration from "./config/database.configuration";
import envConfiguration from "./config/env.configuration";
import { DataSource } from "typeorm";
import { CoursesModule } from './courses/courses.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfiguration()),
    TypeOrmModule.forRoot(databaseConfiguration()),
    AuthModule,
    UsersModule,
    CoursesModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
