import { Test, TestingModule } from '@nestjs/testing';
import { TrainerController } from './trainer.controller';

describe('TrainerController', () => {
  let controller: TrainerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainerController],
    }).compile();

    controller = module.get<TrainerController>(TrainerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
