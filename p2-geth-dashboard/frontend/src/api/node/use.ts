import { UseQueryOptions, useMutation, useQuery, useQueryClient } from 'react-query';
import { NodePeersDto, PostNodeDto } from './dto';
import { deleteNode, getNode, getNodePeers, getNodes, postNode } from './api';

export function usePostNode() {
    const queryClient = useQueryClient();

    const mutation = useMutation((dto: PostNodeDto) => postNode(dto));

    const mutate = async (dto: PostNodeDto) => {
        try {
            await mutation.mutateAsync(dto);
            queryClient.invalidateQueries();
        } catch (error) {
            // do nothing
        }
    };

    return mutate;
}

export function useGetNodes() {
    return useQuery(['getNodes'], () => getNodes());
}

export function useGetNode(id: string) {
    return useQuery(['getNode'], () => getNode(id));
}

export function useGetNodePeers(
    options?: Omit<
        UseQueryOptions<NodePeersDto[] | undefined, unknown, NodePeersDto[], string[]>,
        'queryKey' | 'queryFn'
    >
) {
    return useQuery(['getNodePeers'], () => getNodePeers(), options);
}

export function useDeleteNode() {
    const queryClient = useQueryClient();

    const mutation = useMutation((id: string) => deleteNode(id));

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
