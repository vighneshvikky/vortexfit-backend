import { Controller, Post, Body, Param, Put, UseGuards, Get, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TrainerService } from './trainer.service';
import { TrainerDetailsDto } from './dto/trainer-details.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the file type for multer
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Controller('trainer')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  /**
   * Get trainer details by ID
   * @param trainerId The ID of the trainer
   * @returns The trainer document
   */
  @Get(':trainerId')
  @UseGuards(JwtAuthGuard)
  async getTrainerDetails(@Param('trainerId') trainerId: string) {
    return this.trainerService.findTrainerById(trainerId);
  }

  /**
   * Updates trainer details
   * @param trainerId The ID of the trainer to update
   * @param trainerDetails The details to update
   * @returns The updated trainer document
   */
  @Put(':trainerId')
  @UseGuards(JwtAuthGuard)
  async updateTrainerDetails(
    @Param('trainerId') trainerId: string,
    @Body() trainerDetails: TrainerDetailsDto,
  ) {
    return this.trainerService.updateTrainerDetails(trainerId, trainerDetails);
  }

  /**
   * Upload certification document
   * @param trainerId The ID of the trainer
   * @param file The certification file
   * @returns The updated trainer document
   */
  @Post(':trainerId/certification')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('certification', {
      storage: diskStorage({
        destination: './uploads/certifications',
        filename: (req, file, callback) => {
          const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueFilename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
          return callback(
            new BadRequestException('Only image and PDF files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadCertification(
    @Param('trainerId') trainerId: string,
    @UploadedFile() file: MulterFile,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.trainerService.uploadCertification(trainerId, file);
  }

  /**
   * Upload ID proof document
   * @param trainerId The ID of the trainer
   * @param file The ID proof file
   * @returns The updated trainer document
   */
  @Post(':trainerId/id-proof')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('idProof', {
      storage: diskStorage({
        destination: './uploads/id-proofs',
        filename: (req, file, callback) => {
          const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueFilename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
          return callback(
            new BadRequestException('Only image and PDF files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadIdProof(
    @Param('trainerId') trainerId: string,
    @UploadedFile() file: MulterFile,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.trainerService.uploadIdProof(trainerId, file);
  }
}
