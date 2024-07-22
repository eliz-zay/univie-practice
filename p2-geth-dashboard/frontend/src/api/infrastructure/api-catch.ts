import { AxiosError, isAxiosError } from 'axios'
import { toasts } from '../../infrastructure/toasts';

export function handleAxiosError(error: Error | AxiosError): void {
    if (isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
            return;
        }

        toasts.error(
            error.response?.status === 500
                ? 'Internal server error'
                : error.response?.data.message
        );
    } else {
        throw error;
    }
}
