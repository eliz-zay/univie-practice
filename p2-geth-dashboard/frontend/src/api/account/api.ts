import api from '../../api';
import { handleAxiosError } from '../infrastructure/api-catch';
import { AccountDto, PostAccountDto } from './dto';

export async function postAccount(dto: PostAccountDto): Promise<void> {
    try {
        await api.post('/account', dto);
    } catch (error: any) {
        handleAxiosError(error);
    }
}

export async function getAccounts(): Promise<AccountDto[]> {
    try {
        const response = await api.get('/account');
        return response.data;
    } catch (error: any) {
        handleAxiosError(error);
        return [];
    }
}

export async function deleteAccount(id: string): Promise<void> {
    try {
        await api.delete(`/account/${id}`);
    } catch (error: any) {
        handleAxiosError(error);
    }
}
