import api from '../../api';
import { handleAxiosError } from '../infrastructure/api-catch';
import { GenesisJsonDto, GenesisJsonListDto, GetGenesisJsonListDto, IdDto, PostDataDirDto, PostGenesisJsonDto } from './dto';

export async function postGenesisJson(dto: PostGenesisJsonDto): Promise<IdDto | undefined> {
    try {
        const response = await api.post('/genesis', dto);
        return response.data;
    } catch (error: any) {
        handleAxiosError(error);
    }
}

export async function getGenesisJsonList(dto: GetGenesisJsonListDto): Promise<GenesisJsonListDto[]> {
    try {
        const response = await api.get('/genesis?availableDirsOnly=' + dto.availableDirsOnly);
        return response.data;
    } catch (error: any) {
        handleAxiosError(error);
        return [];
    }
}

export async function getGenesisJson(id: string): Promise<GenesisJsonDto | undefined> {
    try {
        const response = await api.get(`/genesis/${id}`);
        return response.data;
    } catch (error: any) {
        handleAxiosError(error);
    }
}

export async function deleteGenesisJson(id: string): Promise<void> {
    try {
        await api.delete(`/genesis/${id}`);
    } catch (error: any) {
        handleAxiosError(error);
    }
}

export async function postDataDir(dto: PostDataDirDto): Promise<void> {
    try {
        await api.post(`/genesis/data-dir`, dto);
    } catch (error: any) {
        handleAxiosError(error);
    }
}

export async function deleteDataDir(id: string): Promise<void> {
    try {
        await api.delete(`/genesis/data-dir/${id}`);
    } catch (error: any) {
        handleAxiosError(error);
    }
}
