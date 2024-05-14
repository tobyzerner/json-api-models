import pkg from './package.json' assert { type: 'json' };
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.module,
            format: 'es',
        },
    ],
    plugins: [typescript({ tsconfig: './tsconfig.json' }), terser()],
};
