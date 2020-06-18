/* eslint-disable import/prefer-default-export */
import axios from 'axios';

export const fetchServerData = async (url, maxRequestsNumber = 5) => {
  const searchIdRequest = async () => axios.get(url);

  try {
    return await searchIdRequest();
  } catch (error) {
    if (maxRequestsNumber === 0) throw new Error(error, 'AttemptsLimitExceeded');
    return fetchServerData(url, maxRequestsNumber - 1);
  }
};
