import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getDocument, getDocuments, postDocument } from './api';

export function useGetDocuments() {
    return useQuery(['getDocuments'], () => getDocuments());
}

export function useGetDocument(id: string) {
    return useQuery(['getDocument'], () => getDocument(id));
}

export function usePostDocument() {
    const queryClient = useQueryClient();

    const { mutate } = useMutation(
        (formData: FormData) => postDocument(formData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries();
            },
        }
    );

    return mutate;
}
