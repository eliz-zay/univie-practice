import { Repository } from 'typeorm';

import { QueueManager } from '@queuemanager';

import { AttendanceDomainService } from '../../src/service/AttendanceDomainService';
import { Message } from '../../src/model/Message';
import { Registration } from '../../src/model/Registration';

import { cleanUpDatabase, useRepositories } from '../util';

describe('AttendanceDomainService', () => {
  let messageRepository: Repository<Message>;
  let registrationRepository: Repository<Registration>;

  let service: AttendanceDomainService;

  beforeAll(async () => {
    [messageRepository, registrationRepository] = useRepositories([Message, Registration]);

    service = new AttendanceDomainService(registrationRepository, messageRepository);
  });

  afterEach(async () => {
    await cleanUpDatabase([Message, Registration]);
  });

  it('Successfully registers', async () => {
    const eventId = 5;
    const userId = 1;

    QueueManager.callRpcWithReplyTo = jest.fn().mockResolvedValue({ payload: [{ id: eventId }] });
    QueueManager.publishToTopicExchange = jest.fn();

    await service.registerToEvent({ eventId, user: { id: userId } });

    const registrations = await registrationRepository.find();

    expect(QueueManager.callRpcWithReplyTo).toBeCalled();
    expect(QueueManager.publishToTopicExchange).toBeCalledWith('registration', 'create', { attendeeId: userId, eventId });
    expect(registrations).toHaveLength(1);
    expect(registrations[0]).toEqual({ eventId, attendeeId: userId });
  });

  it('Successfully deregisters from event', async () => {
    const eventId = 5;
    const userId = 1;

    await registrationRepository.save({ attendeeId: userId, eventId });

    QueueManager.callRpcWithReplyTo = jest.fn().mockResolvedValue({ payload: [{ id: eventId }] });
    QueueManager.publishToTopicExchange = jest.fn();

    await service.deregisterFromEvent({ eventId, user: { id: userId } });

    const registrations = await registrationRepository.find();

    expect(QueueManager.callRpcWithReplyTo).toBeCalled();
    expect(QueueManager.publishToTopicExchange).toBeCalledWith('registration', 'delete', { attendeeId: userId, eventId });
    expect(registrations).toHaveLength(0);
  });

  it('Successfully sends organizer message', async () => {
    const eventId = 5;
    const userId = 1;
    const text = 'Sample text'

    await registrationRepository.save({ attendeeId: userId, eventId });

    QueueManager.callRpcWithReplyTo = jest.fn().mockResolvedValue({ payload: [{ id: eventId, organizerId: userId }] });
    QueueManager.publishToTopicExchange = jest.fn();

    await service.sendOrganizerMessage({ eventId, user: { id: userId }, text });

    const messages = await messageRepository.find();

    expect(QueueManager.callRpcWithReplyTo).toBeCalled();
    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual(expect.objectContaining({ eventId, senderId: userId, text }));
  });

  it('Successfully gets event messages', async () => {
    const eventId = 5;
    const userId = 1;

    await registrationRepository.save({ attendeeId: userId, eventId });
    await messageRepository.save([
      { eventId, senderId: userId, text: 'Sample text 1' },
      { eventId, senderId: userId, text: 'Sample text 2' },
    ]);

    QueueManager.callRpcWithReplyTo = jest.fn().mockResolvedValue({ payload: [{ id: eventId }] });

    const messages = await service.getEventMessages({ eventId, user: { id: userId } });

    const expectedMessages = await messageRepository.find();

    expect(QueueManager.callRpcWithReplyTo).toBeCalled();
    expect(messages).toEqual(expectedMessages);
  });

  it('Successfully gets attendee events', async () => {
    const userId = 1;
    const events = [
      { id: 1, organizer: 4, title: 'Event #1' },
      { id: 2, organizer: 3, title: 'Event #2' },
      { id: 3, organizer: 6, title: 'Event #3' },
      { id: 4, organizer: 1, title: 'Event #4' },
      { id: 5, organizer: 3, title: 'Event #5' },
    ];

    await registrationRepository.save([{ attendeeId: userId, eventId: 2 }, { attendeeId: userId, eventId: 4 }]);

    QueueManager.callRpcWithReplyTo = jest.fn(async function (queue, replyTo, payload) {
      return { success: true, payload: events.filter((event) => payload.ids.includes(event.id)) };
    });

    const attendeeEvents = await service.getAttendeeEvents({ user: { id: userId } });

    expect(QueueManager.callRpcWithReplyTo).toBeCalled();
    expect(attendeeEvents).toEqual([events[1], events[3]]);
  });

  it('Successfully handles event delete', async () => {
    const [messagesBefore, registrationsBefore] = await Promise.all([
      messageRepository.save([
        { eventId: 1, senderId: 2, text: 'Sample text 1' },
        { eventId: 2, senderId: 4, text: 'Sample text 2' },
        { eventId: 1, senderId: 1, text: 'Sample text 3' },
        { eventId: 3, senderId: 2, text: 'Sample text 4' },
        { eventId: 1, senderId: 3, text: 'Sample text 5' }
      ]),
      registrationRepository.save([
        { eventId: 1, attendeeId: 2 },
        { eventId: 6, attendeeId: 1 },
        { eventId: 2, attendeeId: 6 },
        { eventId: 1, attendeeId: 3 },
        { eventId: 2, attendeeId: 5 }
      ])
    ]);

    await service.onEventDelete(1);

    const [messagesAfter, registrationsAfter] = await Promise.all([messageRepository.find(), registrationRepository.find()]);

    expect(messagesAfter).toEqual([
      expect.objectContaining(messagesBefore[1]),
      expect.objectContaining(messagesBefore[3])
    ]);
    expect(registrationsAfter).toEqual([
      expect.objectContaining(registrationsBefore[1]),
      expect.objectContaining(registrationsBefore[2]),
      expect.objectContaining(registrationsBefore[4])
    ]);
  });
});
