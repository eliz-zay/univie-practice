import moment from 'moment';

export function formatDate(date: Date): string {
    return moment(date).format('YYYY-MM-DD hh:mm:ss');
}
