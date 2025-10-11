import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target:
        'https://new-backend-gradegy-achjhuf0ekbsgtfv.canadacentral-01.azurewebsites.net/schema',
    },
    output: {
      mode: 'tags-split',
      target: 'src/lib/orval/generated',
      schemas: 'src/lib/orval/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      baseUrl: 'https://new-backend-gradegy-achjhuf0ekbsgtfv.canadacentral-01.azurewebsites.net',
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
        zod: {
          strict: {
            response: true,
            query: true,
            param: true,
            header: true,
            body: true,
          },
          generate: {
            response: true,
            query: true,
            param: true,
            header: true,
            body: true,
          },
          coerce: {
            response: false,
            query: false,
            param: false,
            header: false,
            body: false,
          },
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
