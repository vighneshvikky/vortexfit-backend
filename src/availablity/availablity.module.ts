// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import {
//   AvailabilityTemplate,
//   AvailabilityTemplateSchema,
// } from './schemas/availablity.schema';
// import { AvailabilityController } from './controller/availablity.controller';
// import { AvailabilityService } from './services/availablity.service';
// import { AvailabilityRepository } from './repositories/availability.repository';
// import { AVAILABILITY_REPOSITORY } from './interface/availability-repository.interface';
// import { IJwtTokenService } from 'src/auth/interfaces/ijwt-token-service.interface';
// import { JwtTokenService } from 'src/auth/services/jwt/jwt.service';
// import { JwtModule } from '@nestjs/jwt';
// // import { AVAILABILITY_SERVICE } from './interface/availability-service.interface';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       {
//         name: AvailabilityTemplate.name,
//         schema: AvailabilityTemplateSchema,
//       },
//     ]),
//     JwtModule.register({}),
//   ],
//   controllers: [AvailabilityController],
//   providers: [
//     // {
//     //   provide: AVAILABILITY_SERVICE,
//     //   useClass: AvailabilityService,
//     // },
//     {
//       provide: AVAILABILITY_REPOSITORY,
//       useClass: AvailabilityRepository,
//     },
//     {
//       provide: IJwtTokenService,
//       useClass: JwtTokenService,
//     },
//   ],
//   //   exports: [AVAILABILITY_SERVICE],
// })
// export class AvailabilityModule {}
