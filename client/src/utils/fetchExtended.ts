function setHeaders(headers?: Headers): Headers {
  const defaultHeader = new Headers();

  defaultHeader.append("Content-Type", "application/json");

  if (localStorage.getItem("token") !== null) {
    defaultHeader.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`,
    );
  }

  if (headers) {
    for (const [key, value] of headers.entries()) {
      defaultHeader.append(key, value);
    }
  }
  return defaultHeader;
}

const baseURL = "http://localhost:3001/";

export default function fetcher(
  url: string,
  options: RequestInit,
  headers?: Headers,
) {
  const urlWithBase = new URL(url, baseURL);

  for (const [key, val] of setHeaders(headers).entries()) {
    console.log("Header:", key, " val: ", val);
  }

  console.log({ ...options });

  return fetch(urlWithBase, {
    ...options,
    headers: setHeaders(headers),
  });
}
