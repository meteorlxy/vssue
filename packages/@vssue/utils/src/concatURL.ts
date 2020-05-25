export const concatURL = (baseURL: string, path: string): string => {
  const firstPart = baseURL.replace(/\/$/, '');
  const secondPart = path.replace(/^\//, '');
  return `${firstPart}/${secondPart}`;
};
