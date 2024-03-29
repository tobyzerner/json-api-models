import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
        },
        {
            file: pkg.module,
            format: 'es',
        },
        {
            file: pkg.unpkg,
            format: 'iife',
            name: 'JsonApiModels',
        },
    ],
    plugins: [typescript({ tsconfig: './tsconfig.json' }), terser()],
};
