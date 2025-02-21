import { coverageConfigDefaults, defaultExclude, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    exclude: [...defaultExclude, 'samples'],
    coverage: {
      enabled: true,
      provider: 'v8',
      clean: true,
      exclude: [...coverageConfigDefaults.exclude, 'samples', 'bin'],
    },
  },
});
