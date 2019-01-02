import queryString, { OutputParams } from 'query-string'
import format from 'date-fns/format'

export const buildURL = (cleanURL: string, params: Object): string => {
  let query = queryString.stringify(params)
  query = query === '' ? '' : `?${query}`
  return `${cleanURL}${query}`
}

export const concatURL = (baseURL: string, path: string): string => {
  let firstPart = baseURL.replace(/\/$/, '')
  let secondPart = path.replace(/^\//, '')
  return `${firstPart}/${secondPart}`
}

export const getCleanURL = (fullURL: string = window.location.href): string => {
  const cleanURL = queryString.parseUrl(fullURL).url
  return cleanURL
}

export const parseQuery = (URL: string): OutputParams => queryString.parse(URL)

export const buildQuery = (params: Object): string => queryString.stringify(params)

export const formatDateTime = (str: string): string => {
  const dateTime = format(str, 'YYYY-MM-DD HH:mm:ss')
  return dateTime
}

export const noop = () => {}
