import api from '../../api';
import { toasts } from '../../infrastructure/toasts';
import { PostUserDto, UserDto } from './dto';

export async function getUsers(): Promise<UserDto[]> {
    const response = await api.get('/user');
    return response.data;
}

export async function postUser(dto: PostUserDto): Promise<void> {
    try {
        await api.post('/user', dto);
    } catch (error: any) {
        toasts.error(error.response.data.message);
    }
}
