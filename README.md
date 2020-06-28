# pepup-automation-gui
Pepup自動化ツールのGUIバージョン

---

# enviroment
* Base
  * Node.js
  * Koa.js
  * Typescript
* Library
  * Axios
  * Puppeteer
  * node-config-ts
    * ※Need to specify Config.d.ts in package.json
* Test
  * Jest
  * TS-Jest
    * ※Need to specify jest in types of tsconfig.json

# initial setting memo
* get tsconfig.josn
  ```bash
  curl https://raw.githubusercontent.com/Microsoft/TypeScript-Node-Starter/master/tsconfig.json > tsconfig.json
  ```

# Release memo for Heroku
* Need to add the following buildpacks to enable to use puppeteer in Heroku environment
  ```shell
  heroku buildpacks:clear
  heroku buildpacks:add --index 1 https://github.com/jontewks/puppeteer-heroku-buildpack
  heroku buildpacks:add --index 1 heroku/nodejs
  ```
