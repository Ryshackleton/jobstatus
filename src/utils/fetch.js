/* globals fetch:false */
import 'whatwg-fetch';
import { keys, reduce } from 'lodash-es';

function slug(params) {
  return reduce(keys(params), (acc, key, i) => {
    return `${acc}${i ? '&' : '?'}${key}=${params[key]}`;
  }, '');
}

export default async function fetchJSON({ url, params = {} }) {
  try {
    const response = await fetch(
      `${url}${slug(params)}`,
      { headers: { Accept: 'application/json' }, credentials: 'same-origin' },
    );
    if (response.ok) {
      return response.json();
    }
    return `Response.status: ${response.status}`;
  } catch (e) {
    throw e;
  }
}
