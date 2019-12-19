import fetch from 'node-fetch';

const DEFAULT_OPTIONS = { responseType: 'json' };

export const get = async (url, options = {}) => {
  const getOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    method: 'GET'
  };
  const request = await fetch(url, getOptions);
  if (request.status.toString()[0] !== '2') {
    return Promise.reject(request);
  }
  if (getOptions.responseType === 'json') {
    return request.json();
  }
  if (getOptions.responseType === 'text') {
    return request.text();
  }
  return request;
};

export const post = async (url, data = {}, options = {}) => {
  const headers = {
    'content-type': 'application/json',
    ...options.headers
  };
  const postOptions = {
    ...DEFAULT_OPTIONS,
    headers,
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  };
  const request = await fetch(url, postOptions);
  if (request.status.toString()[0] !== '2') {
    return Promise.reject(request);
  }
  if (postOptions.responseType === 'json') {
    return request.json();
  }
  if (postOptions.responseType === 'text') {
    return request.text();
  }
  return request;
};
