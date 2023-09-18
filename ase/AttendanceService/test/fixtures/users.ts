import { AttendeeSchema } from '../../src/service/AttendanceDomainService.schema';

export const users: AttendeeSchema[] = [
    {
        id: 1,
        username: 'user 1',
        firstname: 'user 1',
        lastname: 'user 1',
        role: 'attendee'
    },
    {
        id: 2,
        username: 'user 2',
        firstname: 'user 2',
        lastname: 'user 2',
        role: 'attendee'
    },
    {
        id: 3,
        username: 'user 3',
        firstname: 'user 3',
        lastname: 'user 3',
        role: 'organizer'
    },
];
