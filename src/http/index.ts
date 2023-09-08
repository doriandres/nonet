import axios, { CreateAxiosDefaults } from "axios";
import axiosRetry, { IAxiosRetryConfig } from "axios-retry";

export type HttpClientOptions = CreateAxiosDefaults<any> & IAxiosRetryConfig;

export function createHttpClient(options: IAxiosRetryConfig) {
  const client = axios.create(options as CreateAxiosDefaults<any>);
  axiosRetry(client, options as IAxiosRetryConfig);  
  return client;
}

export class HttpClientFactory {
  private readonly baseOptions: HttpClientOptions;

  constructor(options: HttpClientOptions) {
    this.baseOptions = options;
  }

  public create(options: Partial<HttpClientOptions> = {}) {
    return createHttpClient({ ...this.baseOptions, ...options });
  }
}