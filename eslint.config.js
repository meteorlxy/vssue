import { meteorlxy } from '@meteorlxy/eslint-config';

export default meteorlxy({
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  vue: true,
});
