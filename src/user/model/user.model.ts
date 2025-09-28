import { BaseModel } from 'src/common/model/base-model';

export class UserModel extends BaseModel {
  constructor(
    public readonly dob?: string,
    public readonly height?: number,
    public readonly heightUnit?: string,
    public readonly weight?: number,
    public readonly weightUnit?: string,
    public readonly fitnessLevel?: string,
    public readonly fitnessGoals?: string[],
    public readonly trainingTypes?: string[],
    public readonly preferredTime?: string,
    public readonly equipments?: string[],
  ) {
    super();
  }
}
