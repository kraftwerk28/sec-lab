import fetch from 'node-fetch'

const DEFAULT_OPTIONS = { responseType: 'json' }

export const get = async (url, options = {}) => {
  const getOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    method: 'GET'
  }
  const request = fetch(url, getOptions)
  return request.then(d => {
    if (getOptions.responseType === 'json') {
      return d.json()
    }
    if (getOptions.responseType === 'text') {
      return d.text()
    }
    return d
  })
}

export const post = async (url, data = {}, options = {}) => {
  const headers = {
    'content-type': 'application/json',
    ...options.headers
  }
  const postOptions = {
    ...DEFAULT_OPTIONS,
    headers,
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  }
  const request = fetch(url, postOptions)
  return request.then(d => {
    if (postOptions.responseType === 'json') {
      return d.json()
    }
    if (postOptions.responseType === 'text') {
      return d.text()
    }
    return d
  })
}
