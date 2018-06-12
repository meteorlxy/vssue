import queryString from 'query-string'
import format from 'date-fns/format'

export const buildURL = (cleanURL, params) => {
  let query = queryString.stringify(params)
  query = query === '' ? '' : `?${query}`
  return `${cleanURL}${query}`
}

export const concatURL = (baseURL, path) => {
  let firstPart = baseURL.replace(/\/$/, '')
  let secondPart = path.replace(/^\//, '')
  return `${firstPart}/${secondPart}`
}

export const getCleanURL = (fullURL = window.location.href) => {
  const cleanURL = queryString.parseUrl(fullURL).url
  return cleanURL
}

export const parseQuery = URL => queryString.parse(URL)

export const buildQuery = params => queryString.stringify(params)

export const formatDateTime = str => {
  const dateTime = format(str, 'YYYY-MM-DD HH:mm:ss')
  return dateTime
}

export const noop = () => {}
