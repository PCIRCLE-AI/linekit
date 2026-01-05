import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    clean: true,
    treeshake: true,
    sourcemap: true,
    outExtension({ format }) {
        return {
            js: format === 'cjs' ? '.cjs' : '.js',
        };
    },
});
