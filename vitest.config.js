import { defineConfig , configDefaults} from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: [
      ...configDefaults.exclude,
      'src/tests/firestore.test.js',
    ],
  },
})