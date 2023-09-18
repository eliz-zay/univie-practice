import { EventSchema } from '../../src/service/AttendanceDomainService.schema';

export const events: EventSchema[] = [
    {
        id: 1,
        organizerId: 3,
        title: 'event 1',
        capacity: 2
    },
    {
        id: 2,
        organizerId: 3,
        title: 'event 2',
        capacity: 3
    },
];
