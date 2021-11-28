# SCOPin rock

An instance of [microscope_simulator](https://github.com/Fumipo-Theta/microscope_simulator).

## Deployed app

[SCOPin rock](https://microscope.fumipo-theta.com/)

## Development

- install dependency
  - `yarn install`
- build for deploy
  - `yarn build:prod`
- update core dependency (if needed)
  - `yarn update:core`: update to latest release branch of the microscope_simulator
  - `yarn update:core <git ref>`: update to specified branch, tag, or commit of the microscope_simulator ex. `origin/master` or `2.3.0`
- Launch local server with building for local environment
  - `yarn start`


## Deployment flow

This application use Service Worker for caching files to reduce data transfer size.
Therefore, update the version of the Service Worker is necessary to update the code of the client devices.

The deployment procedure is below.

1. Edit source code
2. Update service worker version
3. Build and deploy changes
4. Clear cache of CDN if it is necessary
