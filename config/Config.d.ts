/* tslint:disable */

/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    name: string
    version: string
    description: string
    environment: string
    service: Service
    google: Google
    pepup: Pepup
    settings: Settings
  }
  interface Pepup {
    url: Url
    configs: Configs
  }
  interface Configs {
    sleepTime: number
    dateFormat: string
    errorLimit: number
    daysLimit: number,
    isHeadless: boolean
  }
  interface Url {
    base: string
    login: string
    api: string
    page: string
  }
  interface Google {
    scope: string[]
    token_path: string
    credentials_path: string
    work_dir: string
  }
  interface Service {
    uri: string
    port: string
  }
  interface Settings {
    htmlDateFromat: string
  }
  export const config: Config
  export type Config = IConfig
}
