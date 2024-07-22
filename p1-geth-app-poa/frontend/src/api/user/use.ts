import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getUsers, postUser } from './api';
import { PostUserDto } from './dto';

export function useGetUsers() {
    return useQuery(['getUsers'], () => getUsers());
}

export function usePostUser() {
    const queryClient = useQueryClient();

    const { mutate } = useMutation(
        (dto: PostUserDto) => postUser(dto),
        {
            onSuccess: () => {
                queryClient.invalidateQueries();
            },
        }
    );

    return mutate;
}
