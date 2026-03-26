import axios from "axios";

// Introduces an artificial delay when fetching things, for illustrative purposes.

function sleep(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export const agent = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

agent.interceptors.response.use(async (response) => {
  try {
    await sleep(1000);
    return response;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
});
