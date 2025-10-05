import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:5400/schema',
    },
    output: {
      mode: 'tags-split',
      target: 'src/lib/orval/generated',
      schemas: 'src/lib/orval/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      baseUrl: 'http://localhost:5400',
      override: {
        mutator: {
          path: 'src/lib/orval/custom-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
      clean: true,
      tsconfig: './tsconfig.orval.json',
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
