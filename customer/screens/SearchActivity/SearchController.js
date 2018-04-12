'use strict';
import { fetchTravoramaApi, AUTH_LEVEL } from '../../../api/Common';

function getQueryPath(key, value, pageNumber) {
  const version = 'v1';
  const data = {
    startDate: '2017-02-18',
    // pretty: '1',
    // encoding: 'json',
    // listing_type: 'buy',
    // action: 'search_listings',
    // page: pageNumber,
  };
  data[key] = value;
  //?name=hiking&startDate=2017-02-18&endDate=2017-02-30&page=1&perPage=10

  const querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  /// wisata dan kegiatan
  return `/${version}/activities?${querystring}`;
}

export default async function search(searchString) {
  const path = getQueryPath('name', searchString, 1);
  let request = { path, requiredAuthLevel: AUTH_LEVEL.Guest }
  try {
    let response = await fetchTravoramaApi(request);
    if (response) {
      return response.activityList;
    } else {
      console.error('SearchAPI: no response returned!');
      return 'no response returned';
    }
  } catch (error) {
    console.error(error);
  }
}