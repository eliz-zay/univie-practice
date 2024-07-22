import { toast } from 'react-toastify'

const position = 'top-right';

export const toasts = Object.freeze({
    info(title: string, message: string, onClick: VoidFunction) {
        toast.info(
            <div className='text-container'>
                <b>{title}</b>
                <p>{message}</p>
            </div>,
            { onClick, position },
        )
    },
    error(message: string | string[]) {
        toast.error(
            <div className='text-container'>
                <b>{Array.isArray(message) ? message.join('; ') : message}</b>
            </div>,
            { position },
        )
    },
    success(message: string) {
        toast.success(
            <div className='text-container'>
                <b>{message}</b>
            </div>,
            { position },
        )
    },
    warning(message: string) {
        toast.warning(
            <div className='text-container'>
                <b>{message}</b>
            </div>,
            { position },
        )
    },
});
