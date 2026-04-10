import { NotificationService } from './notification.service';
import {
  NotificationChannel,
  NotificationChannelName,
  NotificationMessage,
} from './interfaces/notification.types';
import { NotificationTemplateService } from './templates/notification-template.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let channel: jest.Mocked<NotificationChannel>;

  beforeEach(() => {
    channel = {
      channel: NotificationChannelName.EMAIL,
      send: jest.fn(),
    };

    service = new NotificationService(
      new NotificationTemplateService(),
      [channel],
    );
  });

  it('routes reservation created notifications through the configured channel', async () => {
    service.sendReservationCreatedBestEffort({
      recipientEmail: 'customer@example.com',
      recipientName: 'Customer',
      salonName: 'Ustura Premium',
      staffDisplayName: 'Barber One',
      slotStart: new Date('2026-04-10T10:00:00.000Z'),
      slotEnd: new Date('2026-04-10T10:30:00.000Z'),
    });

    await new Promise(process.nextTick);

    expect(channel.send).toHaveBeenCalledWith(
      expect.objectContaining<Partial<NotificationMessage>>({
        key: 'reservation.created',
        recipient: expect.objectContaining({
          email: 'customer@example.com',
        }),
        channels: [NotificationChannelName.EMAIL],
      }),
    );
  });

  it('swallows channel delivery errors for best-effort notifications', async () => {
    channel.send.mockRejectedValue(new Error('smtp unavailable'));

    expect(() =>
      service.sendOwnerApprovedBestEffort({
        recipientEmail: 'owner@example.com',
        recipientName: 'Owner',
        salonName: 'Ustura Premium',
        approvedAt: new Date('2026-04-10T12:00:00.000Z'),
      }),
    ).not.toThrow();

    await new Promise(process.nextTick);

    expect(channel.send).toHaveBeenCalledTimes(1);
  });
});
