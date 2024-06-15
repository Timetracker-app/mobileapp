import axios from 'axios';

const testUrl = 'http://10.0.2.2:5000';

export const customFetch = axios.create({
  baseURL: testUrl,
});

export const formatDate = timestamp => {
  const date = new Date(timestamp);

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  return formattedDate;
};

export const formatFilterDate = timestamp => {
  const date = new Date(timestamp);

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

  return formattedDate;
};

export const formatDateTime = datetime => {
  const date = new Date(datetime);

  const optionsDate = {year: 'numeric', month: '2-digit', day: '2-digit'};
  const optionsTime = {hour: '2-digit', minute: '2-digit', hour12: false};

  const formattedDate = new Intl.DateTimeFormat('en-CA', optionsDate).format(
    date,
  ); // 'en-CA' ensures the format YYYY-MM-DD
  const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(
    date,
  ); // 'en-GB' ensures the format HH:MM

  return `${formattedDate}T${formattedTime}`;
};

export const formatFilterDateTime = datetime => {
  console.log(datetime);
  const date = new Date(datetime);

  const optionsDate = {year: 'numeric', month: '2-digit', day: '2-digit'};

  const formattedDate = new Intl.DateTimeFormat('en-CA', optionsDate).format(
    date,
  ); // 'en-CA' ensures the format YYYY-MM-DD

  return `${formattedDate}`;
};
