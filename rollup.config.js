import typescript  from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    // dir: 'dist',
    file: 'dist/spring-challenge-2022.ts',
    format: 'cjs'
  },
  plugins: [typescript()]
};
