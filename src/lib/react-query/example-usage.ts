/**
 * TanStack Query Usage Examples
 *
 * This file demonstrates how to use React Query in your application.
 * Delete this file once you understand the patterns.
 */

import axios from 'axios';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

// ----------------------------------------------------------------------
// Example API functions
// ----------------------------------------------------------------------

async function fetchUsers() {
  const { data } = await axios.get('/api/users');
  return data;
}

async function fetchUserById(id: string) {
  const { data } = await axios.get(`/api/users/${id}`);
  return data;
}

async function createUser(userData: any) {
  const { data } = await axios.post('/api/users', userData);
  return data;
}

async function updateUser({ id, ...userData }: any) {
  const { data } = await axios.put(`/api/users/${id}`, userData);
  return data;
}

async function deleteUser(id: string) {
  const { data } = await axios.delete(`/api/users/${id}`);
  return data;
}

// ----------------------------------------------------------------------
// Example Query Hook - Fetching Data
// ----------------------------------------------------------------------

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}

// Usage in component:
// const { data, isLoading, error, refetch } = useUsers();

// ----------------------------------------------------------------------
// Example Query with Parameters
// ----------------------------------------------------------------------

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUserById(id),
    enabled: !!id, // Only run query if id exists
  });
}

// Usage in component:
// const { data: user, isLoading } = useUser(userId);

// ----------------------------------------------------------------------
// Example Mutation Hook - Creating Data
// ----------------------------------------------------------------------

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Usage in component:
// const { mutate: createUser, isPending } = useCreateUser();
// createUser({ name: 'John Doe', email: 'john@example.com' });

// ----------------------------------------------------------------------
// Example Mutation Hook - Updating Data
// ----------------------------------------------------------------------

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data, variables) => {
      // Invalidate specific user and users list
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Usage in component:
// const { mutate: updateUser } = useUpdateUser();
// updateUser({ id: '123', name: 'Jane Doe' });

// ----------------------------------------------------------------------
// Example Mutation Hook - Deleting Data
// ----------------------------------------------------------------------

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Usage in component:
// const { mutate: deleteUser } = useDeleteUser();
// deleteUser('123');

// ----------------------------------------------------------------------
// Advanced Example - Optimistic Updates
// ----------------------------------------------------------------------

export function useOptimisticUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onMutate: async (updatedUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user', updatedUser.id] });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(['user', updatedUser.id]);

      // Optimistically update to the new value
      queryClient.setQueryData(['user', updatedUser.id], updatedUser);

      return { previousUser };
    },
    onError: (err, updatedUser, context) => {
      // Rollback on error
      queryClient.setQueryData(['user', updatedUser.id], context?.previousUser);
    },
    onSettled: (data, error, variables) => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
}

// ----------------------------------------------------------------------
// Advanced Example - Pagination
// ----------------------------------------------------------------------

export function useUsersPaginated(page: number) {
  return useQuery({
    queryKey: ['users', 'paginated', page],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users?page=${page}`);
      return data;
    },
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

// Usage in component:
// const [page, setPage] = useState(1);
// const { data, isLoading, isPlaceholderData } = useUsersPaginated(page);

// ----------------------------------------------------------------------
// Advanced Example - Infinite Query
// ----------------------------------------------------------------------

export function useUsersInfinite() {
  return useInfiniteQuery({
    queryKey: ['users', 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(`/api/users?page=${pageParam}`);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}

// Usage in component:
// const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useUsersInfinite();
