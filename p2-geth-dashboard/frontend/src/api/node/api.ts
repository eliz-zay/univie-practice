import api from '../../api';
import { handleAxiosError } from '../infrastructure/api-catch';
import { NodeCardDto, NodeListDto, NodePeersDto, PostNodeDto } from './dto';

export async function postNode(dto: PostNodeDto): Promise<void> {
    try {
        await api.post('/node', dto);
    } catch (error: any) {
        handleAxiosError(error);
    }
}

export async function getNodes(): Promise<NodeListDto[]> {
    try {
        const response = await api.get('/node');
        return response.data;
    } catch (error: any) {
        handleAxiosError(error);
        return [];
    }
}

export async function getNodePeers(): Promise<NodePeersDto[]> {
    try {
        const response = await api.get('/node/peer');
        return response.data;
    } catch (error: any) {
        handleAxiosError(error);
        return [];
    }
}

export async function getNode(id: string): Promise<NodeCardDto | undefined> {
    try {
        const response = await api.get(`/node/${id}`);
        return response.data;
    } catch (error: any) {
        handleAxiosError(error);
    }
}

export async function deleteNode(id: string): Promise<void> {
    try {
        await api.delete(`/node/${id}`);
    } catch (error: any) {
        handleAxiosError(error);
    }
}
