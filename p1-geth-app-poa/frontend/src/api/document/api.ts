import api from '../../api';
import { toasts } from '../../infrastructure/toasts';
import { DocumentDto, DocumentTableDto } from './dto';

export async function getDocuments(): Promise<DocumentTableDto[]> {
    const response = await api.get('/document');
    return response.data;
}

export async function getDocument(id: string): Promise<DocumentDto> {
    try {
        const response = await api.get(`/document/${id}`);
        return response.data;
    } catch (error: any) {
        toasts.error(error.response.data.message);
        throw error;
    }
}

export async function postDocument(formData: FormData): Promise<void> {
    try {
        await api.post('/document', formData);
    } catch (error: any) {
        toasts.error(error.response.data.message);
    }
}

function downloadFile(blob: Blob, name: string) {
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
}

export async function downloadDocument(id: string, title: string): Promise<void> {
    try {
        const response = await api.get(`/document/${id}/download`, {
            responseType: 'blob'
        });
        downloadFile(response.data, title);
    } catch (error: any) {
        toasts.error(error.response.data.message);
    }
}

export async function deleteDocument(id: string): Promise<void> {
    try {
        await api.delete(`/document/${id}`);
    } catch (error: any) {
        toasts.error(error.response.data.message);
    }
}
