# TanStack Query (React Query) Setup

TanStack Query is configured and ready to use in this project for efficient server state management.

## 📦 What's Installed

- `@tanstack/react-query` - Core library
- `@tanstack/react-query-devtools` - DevTools for debugging

## ⚙️ Configuration

### Query Client Settings

The query client is configured with the following defaults in [`query-client.ts`](./query-client.ts):

```typescript
{
  queries: {
    refetchOnWindowFocus: false,  // Don't refetch when window regains focus
    retry: 1,                      // Retry failed requests once
    staleTime: 5 * 60 * 1000,     // Data is fresh for 5 minutes
  }
}
```

### Provider Setup

The `QueryProvider` is integrated in the app layout and includes:
- QueryClientProvider for React Query functionality
- ReactQueryDevtools for debugging (development only)

## 🚀 Usage

### Basic Query (GET)

```tsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get('/api/users');
      return data;
    },
  });
}

// In component
function UsersList() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render users */}</div>;
}
```

### Mutations (POST/PUT/DELETE)

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const { data } = await axios.post('/api/users', userData);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// In component
function CreateUserForm() {
  const { mutate, isPending } = useCreateUser();

  const handleSubmit = (userData) => {
    mutate(userData);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## 🔍 DevTools

React Query DevTools are automatically included in development mode. Access them by:
- Click the TanStack Query icon in the bottom-left corner of your browser
- View query states, cache data, and debugging information

## 📚 Recommended Folder Structure

Create your API hooks in organized folders:

```
src/
├── api/
│   ├── users/
│   │   ├── use-users.ts
│   │   ├── use-user.ts
│   │   ├── use-create-user.ts
│   │   └── use-update-user.ts
│   ├── products/
│   │   ├── use-products.ts
│   │   └── ...
│   └── index.ts
```

## 🎯 Best Practices

1. **Use Specific Query Keys**: Make keys unique and descriptive
   ```ts
   ['users']              // ✅ List of users
   ['user', id]          // ✅ Specific user
   ['users', { page: 1 }] // ✅ Paginated users
   ```

2. **Invalidate Related Queries**: After mutations, invalidate affected queries
   ```ts
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['users'] });
   }
   ```

3. **Handle Loading & Error States**: Always handle these states in your UI

4. **Use Enabled Option**: Control when queries run
   ```ts
   useQuery({
     queryKey: ['user', id],
     queryFn: () => fetchUser(id),
     enabled: !!id, // Only run if id exists
   })
   ```

## 📖 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Example Usage](./example-usage.ts)
