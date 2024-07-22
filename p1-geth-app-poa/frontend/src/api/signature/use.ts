import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createSignature } from './api';
import { PostSignatureParam } from './dto';

export function usePostSignature() {
    const queryClient = useQueryClient();

    const { mutate } = useMutation(
        (dto: PostSignatureParam) => createSignature(dto),
        {
            onSuccess: () => {
                queryClient.invalidateQueries();
            },
        }
    );

    return mutate;
}
