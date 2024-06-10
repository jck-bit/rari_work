const api = {
    url : "https://jsonplaceholder.typicode.com/photos/",
}

const cachedRequests: Record<string, unknown> =
JSON.parse(localStorage.getItem('cachedRequests') || '{}');


interface ResponseSchema<T> {
    count: number,
    next: string,
    previous: string,
    results: T[],
  }

  async function get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const searchParams = new URLSearchParams(params);
    const endpointAndParams = `${endpoint}?${searchParams}`;
    if (cachedRequests[endpointAndParams]) return cachedRequests[endpointAndParams] as Promise<T>;
    const response = await fetch(`${api.url}${endpointAndParams}`);
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    cachedRequests[endpointAndParams] = data;
    localStorage.setItem('cachedRequests', JSON.stringify(cachedRequests));
    return data;
  }
  
  export type { ResponseSchema };
  export { get };