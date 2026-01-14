import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  IPlanRepository,
  IPLANREPOSITORY,
} from 'src/plans/repository/interface/plan.repository.interface';
import {
  ISubscriptionRepository,
  ISUBSCRIPTIONREPOSITORY,
} from '../repository/interface/subscription.inteface.repository';
import { ISubscriptionService } from './interface/ISubscription.service';
import { SubscriptionMapper } from '../mapper/mapper.subscription';
import { SubscriptionResponseDto } from '../dto/subscription.dto';
import {
  INotificationService,
  INOTIFICATIONSERVICE,
} from 'src/notifications/services/interface/INotification.service.interface';
import { NotificationType } from 'src/notifications/schema/notification.schema';
import { NotificationGateway } from 'src/notifications/notification.gateway';
import { PLANACTION, PLANCYCLEENUM } from '../enum/subscription.enum';
import { IUSEREPOSITORY, IUserRepository } from '@/user/interfaces/user-repository.interface';
import { ITRAINEREPOSITORY, ITrainerRepository } from '@/trainer/interfaces/trainer-repository.interface';
import { ROLE } from '@/common/enums/role.enum';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @Inject(ISUBSCRIPTIONREPOSITORY)
    private readonly _subscriptionRepository: ISubscriptionRepository,
    @Inject(IPLANREPOSITORY) private readonly _planRepository: IPlanRepository,
    @Inject(INOTIFICATIONSERVICE)
    private readonly _notificationService: INotificationService,
    private readonly _notificationGateway: NotificationGateway,
    @Inject(IUSEREPOSITORY)
    private readonly _userRepository: IUserRepository,
    @Inject(ITRAINEREPOSITORY)
    private readonly _trainerRepository: ITrainerRepository,
  ) {}

  async subscribeUserToPlan(
    role: string,
    userId: string,
    planId: string,
    razorpay_order_id?: string,
    razorpay_payment_id?: string,
    razorpay_signature?: string,
  ): Promise<SubscriptionResponseDto> {
    const plan = await this._planRepository.findById(planId);
    if (!plan) throw new NotFoundException('Plan not found');

    let name: string;

    if (role === ROLE.USER) {
      const user = await this._userRepository.findById(userId);
      if (!user) throw new NotFoundException('User not found');
      name = user.name;
    } else if (role === ROLE.TRAINER) {
      const trainer = await this._trainerRepository.findById(userId);
      if (!trainer) throw new NotFoundException('Trainer not found');
      name = trainer.name;
    } else {
      throw new NotFoundException('Invalid role');
    }

    const startDate = new Date();
    let endDate: Date;

    if (plan.billingCycle === PLANCYCLEENUM.MONTHLY) {
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);
    } else if (plan.billingCycle === PLANCYCLEENUM.YEARLY) {
      endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 1);
    } else {
      throw new NotFoundException('Invalid plan duration');
    }

    const subscription = await this._subscriptionRepository.create({
      userId: new Types.ObjectId(userId),
      planId: new Types.ObjectId(planId),
      startDate,
      endDate,
      status: PLANACTION.ACTIVE,
      price: plan.price,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      paymentSignature: razorpay_signature,
    });

    const adminID = process.env.ADMIN_ID!;
    const userMessage = `You have successfully subscribed to the plan "${plan.name}".`;
    const adminMessage = `${name} subscribed to the plan "${plan.name}".`;

    const notificationUser = await this._notificationService.createNotification(
      userId,
      NotificationType.SUBSCRIPTION,
      userMessage,
    );

    const notificationAdmin =
      await this._notificationService.createNotification(
        adminID,
        NotificationType.SUBSCRIPTION,
        adminMessage,
      );

    this._notificationGateway.sendNotification(userId, notificationUser);
    this._notificationGateway.sendNotification(adminID, notificationAdmin);

    return SubscriptionMapper.toDto(subscription);
  }

  async getUserSubscriptions(
    userId: string,
  ): Promise<SubscriptionResponseDto[]> {
    const subscriptions =
      await this._subscriptionRepository.findByUserId(userId);
    return SubscriptionMapper.toDtoList(subscriptions);
  }

  async findActiveByUserAndPlan(
    userId: string,
    planId: string,
  ): Promise<SubscriptionResponseDto | null> {
    const data = await this._subscriptionRepository.findActiveByUserAndPlan(
      userId,
      planId,
    );
    if (!data) return null;

    return SubscriptionMapper.toDto(data);
  }

  hasActiveSubscription(userId: string): Promise<boolean> {
    return this._subscriptionRepository.hasActiveSubscription(userId);
  }
}
