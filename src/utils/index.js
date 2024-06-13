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

export const timeDiff = (zacetni_cas, koncni_cas) => {
  const t1 = new Date(zacetni_cas);
  const t2 = new Date(koncni_cas);
  const diff = t2.getTime() - t1.getTime();

  const optionsTime = {hour: '2-digit', minute: '2-digit', hour12: false};

  const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(
    diff,
  );

  return `${formattedTime}`;
};
