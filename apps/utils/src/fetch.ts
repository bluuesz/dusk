import fetch from 'node-fetch';

const request = async <T>(endpoint: string /* method: 'POST' | 'GET' */) => {
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const responseTxt = await response.text();

    return Promise.reject(new Error(responseTxt));
  }

  const data = (await response.json()) as T;

  return data;
};

export { request };
