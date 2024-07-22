import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteAccount, getAccounts, postAccount } from './api';
import { PostAccountDto } from './dto';

export function usePostAccount() {
    const queryClient = useQueryClient();

    const mutation = useMutation((dto: PostAccountDto) => postAccount(dto));

    const mutate = async (dto: PostAccountDto) => {
        try {
            await mutation.mutateAsync(dto);
            queryClient.invalidateQueries();
        } catch (error) {
            // do nothing
        }
    };

    return mutate;
}

export function useGetAccounts() {
    return useQuery(['getAccounts'], () => getAccounts());
}

export function useDeleteAccount() {
    const queryClient = useQueryClient();

    const mutation = useMutation((id: string) => deleteAccount(id));

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
