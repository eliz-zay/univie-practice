import api from '../../api';
import { toasts } from '../../infrastructure/toasts';
import { PostSignatureParam } from './dto';

export async function createSignature(param: PostSignatureParam): Promise<void> {
    try {
        await api.post('/signature', param);
    } catch (error: any) {
        toasts.error(error.response.data.message);
    }
}
