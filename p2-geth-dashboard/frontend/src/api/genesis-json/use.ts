import { useMutation, useQuery, useQueryClient } from 'react-query';
import { GetGenesisJsonListDto, PostDataDirDto, PostGenesisJsonDto } from './dto';
import { deleteDataDir, deleteGenesisJson, getGenesisJson, getGenesisJsonList, postDataDir, postGenesisJson } from './api';

export function usePostGenesisJson() {
    const queryClient = useQueryClient();

    const mutation = useMutation((dto: PostGenesisJsonDto) => postGenesisJson(dto));

    const mutate = async (dto: PostGenesisJsonDto) => {
        try {
            const response = await mutation.mutateAsync(dto);
            queryClient.invalidateQueries();
            return response;
        } catch (error) {
            // do nothing
        }
    };

    return mutate;
}

export function useGetGenesisJsonList(dto: GetGenesisJsonListDto) {
    return useQuery(['getGenesisJsonList'], () => getGenesisJsonList(dto));
}

export function useGetGenesisJson(id: string) {
    return useQuery(['getGenesisJson'], () => getGenesisJson(id));
}

export function useDeleteGenesisJson() {
    const queryClient = useQueryClient();

    const mutation = useMutation((id: string) => deleteGenesisJson(id));

    const mutate = async (id: string) => {
        try {
            await mutation.mutateAsync(id);
            queryClient.invalidateQueries();
        } catch (error) {
            // do nothing
        }
    };

    return mutate;
}

export function usePostDataDir() {
    const queryClient = useQueryClient();

    const mutation = useMutation((dto: PostDataDirDto) => postDataDir(dto));

    const mutate = async (dto: PostDataDirDto) => {
        try {
            await mutation.mutateAsync(dto);
            queryClient.invalidateQueries();
        } catch (error) {
            // do nothing
        }
    };

    return mutate;
}

export function useDeleteDataDir() {
    const queryClient = useQueryClient();

    const mutation = useMutation((id: string) => deleteDataDir(id));

    const mutate = async (id: string) => {
        try {
            await mutation.mutateAsync(id);
            queryClient.invalidateQueries();
        } catch (error) {
            // do nothing
        }
    };

    return mutate;
}
