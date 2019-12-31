// https://www.oauth.com/playground/authorization-code-with-pkce.html

/**
 * Step 1 - 1
 *
 * Generate code verifier
 */
const generateCodeVerifier = (length: number = 43): string => {
  let len: number = length
  if (len < 43) len = 43
  if (len > 128) len = 128

  const randomArr = window.crypto.getRandomValues(new Uint8Array(len))
  const validChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'

  let codeVerifier = ''

  for (const i of randomArr) {
    codeVerifier += validChars[i % len]
  }

  return codeVerifier
}

/**
 * Step 1 -2
 *
 * Generate code challenge
 */
const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const data = new TextEncoder().encode(codeVerifier)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}
