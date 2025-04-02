import { Module } from '@nestjs/common';
import { UserpackageService } from './userpackage.service';
import { UserpackageController } from './userpackage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Userpackage } from './entities/userpackage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Userpackage])],
  controllers: [UserpackageController],
  providers: [UserpackageService],
})
export class UserpackageModule {}
