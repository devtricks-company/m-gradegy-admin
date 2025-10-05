# Orval API Client

This directory contains the Orval-generated API client for the backend API.

## Quick Start

### 1. Generate API Client

Make sure your backend is running at `http://localhost:5400`, then run:

```bash
yarn orval
```

### 2. Use in Components

```typescript
import { useUsersControllerFindAll, useUsersControllerCreate } from 'src/lib/orval/generated/users/users';
import type { CreateUserDto } from 'src/lib/orval/generated/model';

function UsersPage() {
  // Query hook for GET requests
  const { data, isLoading, error, refetch } = useUsersControllerFindAll();

  // Mutation hook for POST/PUT/DELETE requests
  const { mutate: createUser, isPending } = useUsersControllerCreate();

  const handleCreateUser = () => {
    const newUser: CreateUserDto = {
      email: 'user@example.com',
      password: 'password123',
      // ... other fields
    };

    createUser(
      { data: newUser },
      {
        onSuccess: (data) => {
          console.log('User created:', data);
          refetch(); // Refetch users list
        },
        onError: (error) => {
          console.error('Failed to create user:', error);
        },
      }
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={handleCreateUser} disabled={isPending}>
        Create User
      </button>
      {/* Render users... */}
    </div>
  );
}
```

## Directory Structure

```
src/lib/orval/
├── custom-instance.ts    # Custom axios mutator (integrates with auth)
├── generated/            # Auto-generated files (DO NOT EDIT MANUALLY)
│   ├── access-control/   # Access control endpoints
│   ├── auth/             # Authentication endpoints
│   ├── users/            # Users endpoints
│   ├── ...               # Other endpoint groups
│   └── model/            # TypeScript types/interfaces
└── README.md             # This file
```

## Configuration

See [orval.config.ts](../../../orval.config.ts) for Orval configuration:

- **Input**: OpenAPI schema from `http://localhost:5400/schema`
- **Output**: Generated files in `src/lib/orval/generated/`
- **Client**: React Query hooks
- **HTTP Client**: Axios with custom instance (includes auth interceptors)
- **Mode**: Tags-split (one file per OpenAPI tag)

## Features

✅ **Type-Safe**: Fully typed API requests and responses
✅ **React Query Integration**: Automatic caching, refetching, and state management
✅ **Auth Support**: Integrates with existing axios instance (auth tokens, interceptors)
✅ **Auto-Generated**: Run `yarn orval` when backend API changes
✅ **Organized**: Endpoints grouped by OpenAPI tags

## Common Patterns

### Query with Parameters

```typescript
const { data } = useUsersControllerFindOne({ id: '123' });
```

### Mutation with Optimistic Updates

```typescript
const queryClient = useQueryClient();

const { mutate } = useUsersControllerUpdate({
  mutation: {
    onMutate: async (variables) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['users'] });

      // Optimistically update UI
      const previousUsers = queryClient.getQueryData(['users']);
      queryClient.setQueryData(['users'], (old) => {
        // Update logic...
      });

      return { previousUsers };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['users'], context?.previousUsers);
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  },
});
```

### Conditional Queries

```typescript
const { data } = useUsersControllerFindOne(
  { id: userId },
  {
    query: {
      enabled: !!userId, // Only fetch if userId exists
    },
  }
);
```

## Troubleshooting

### Generation Fails

- Ensure backend is running at `http://localhost:5400`
- Check that `/schema` endpoint returns valid OpenAPI JSON
- Verify network connectivity to the backend

### Type Errors

- Run `yarn orval` to regenerate with latest schema
- Check that imported types match the current schema
- Clear TypeScript cache: `rm -rf .next tsconfig.tsbuildinfo`

### Import Errors

- Use absolute imports: `src/lib/orval/generated/...`
- Check ESLint import order (Orval imports should follow hooks/utils)
