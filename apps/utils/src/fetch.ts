import fetch, { HeadersInit, BodyInit } from 'node-fetch';

const request = async <T>(
  endpoint: string,
  method?: 'POST' | 'GET',
  headers?: HeadersInit,
  body?: BodyInit
) => {
  const response = await fetch(endpoint, {
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body,
  });

  if (!response.ok) {
    const responseTxt = await response.text();

    return Promise.reject(new Error(responseTxt));
  }

  const data = (await response.json()) as T;

  return data;
};

export { request };
