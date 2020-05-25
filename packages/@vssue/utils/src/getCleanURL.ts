export const getCleanURL = (fullURL: string): string => {
  const noHash = fullURL.split('#')[0] || '';
  const cleanURL = noHash.split('?')[0] || '';
  return cleanURL;
};
