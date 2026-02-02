import { axiosPrivate } from "../api/axios.api";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken.hooks";
import useAuth from "./useAuth.hooks";
import { useDispatch } from "react-redux";
import { logOut } from "../features/auth/authSlice";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { accessToken } = useAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers["Authorization"] && accessToken) {
                    config.headers["Authorization"] = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                // Backend sends 401 for "Invalid Refresh Token" or "Unauthorized"
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    try {
                        const newAccessToken = await refresh();
                        prevRequest.headers["Authorization"] =
                            `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);
                    } catch (refreshError) {
                        // Refresh token failed/expired. Log user out completely.
                        dispatch(logOut());
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            },
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [accessToken, refresh, dispatch]);

    return axiosPrivate;
};

export default useAxiosPrivate;

//request config structure
/*
{
  url: '/users/42',
  method: 'get',              // 'get', 'post', 'put', 'delete', etc.
  baseURL: 'https://api.site.com',
  headers: {
    Accept: 'application/json, text/plain, *'/*',
    'Content-Type': 'application/json',
    Authorization: 'Bearer <token>'
  },
  params: {                   // for query string
    page: 1,
    limit: 10
  },
  data: {                     // request body (POST, PUT, PATCH)
    name: 'John',
    age: 30
  },
  timeout: 5000,              // ms
  withCredentials: false,     // cookies
  responseType: 'json',       // 'json', 'blob', 'text'
  onUploadProgress: fn,
  onDownloadProgress: fn,
  transformRequest: [fn],
  transformResponse: [fn],
  cancelToken: CancelToken,
  signal: AbortSignal,
  adapter: fn,
  validateStatus: fn,
  metadata: {}                // custom fields (you can add your own)
}

*/

//request error structure
/*
{
  message: 'Request setup failed',
  name: 'Error',
  config: { ...same config object... },
  code: 'ERR_BAD_OPTION',     // or similar
  stack: 'Error: ...'
}

*/

//respnse object structure
/*
{
  data: {                     // response body (already parsed)
    id: 42,
    name: 'John'
  },
  status: 200,                // HTTP status code
  statusText: 'OK',
  headers: {
    'content-type': 'application/json',
    'cache-control': 'no-cache'
  },
  config: {                   // original request config
    url: '/users/42',
    method: 'get',
    headers: { ... }
  },
  request: XMLHttpRequest     // browser request object
  // OR request: ClientRequest (Node.js)
}

*/

//response error structure
/*
{
  message: 'Request failed with status code 401',
  name: 'AxiosError',
  code: 'ERR_BAD_REQUEST',     // or ERR_NETWORK, ERR_TIMEOUT
  config: { ...original config... },
  request: XMLHttpRequest,    // exists if request was sent
  response: {
    data: {
      message: 'Unauthorized'
    },
    status: 401,
    statusText: 'Unauthorized',
    headers: { ... },
    config: { ... },
    request: XMLHttpRequest
  },
  isAxiosError: true,
  stack: 'AxiosError: ...'
}

*/

//flow diagram
/*
1. Axios Private Instance is created with baseURL, headers, and withCredentials.
2. useAxiosPrivate Hook is defined.
3. Inside the hook:
   a. useRefreshToken Hook is called to get the refresh function.
    b. useAuth Hook is called to get the current accessToken.
    c. useDispatch Hook is called to get the Redux dispatch function.
    d. useEffect Hook is used to set up interceptors on the Axios Private Instance.
        i. Request Interceptor:
              - Checks if the Authorization header is missing and adds it with the current accessToken.
        ii. Response Interceptor:
              - Checks for 401 Unauthorized responses.
              - If a 401 is encountered and the request hasn't been retried yet:
                    * Calls the refresh function to get a new accessToken.
                    * Updates the Redux store with the new accessToken.
                    * Updates the Authorization header of the original request.
                    * Retries the original request with the new token.
                    * If the refresh fails, dispatches logOut to clear user data.
   e. Cleans up the interceptors when the component using the hook unmounts.
4. The configured Axios Private Instance is returned for use in API calls.
*/
