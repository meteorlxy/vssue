import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  entries: ['./src/index.ts'],
  rollup: {
    emitCJS: true,
  },
});
