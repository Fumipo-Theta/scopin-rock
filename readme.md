# SCOPin rock

An instance of [microscope_simulator](https://github.com/Fumipo-Theta/microscope_simulator).

## Deployed app

- [prod](https://microscope.fumipo-theta.com/)
- [dev](https://scopinrock-dev.fumipo-theta.com/)

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
  - then open http://localhost:8080

See details in [this document (Japanese only, English T.B.D)](/docs/how_to_release_your_app.md)

## Deployment flow

This application use Service Worker for caching files to reduce data transfer size.
Therefore, update the version of the Service Worker is necessary to update the code of the client devices.

The deployment procedure is below.

1. Edit source code
2. Update package version (also in order to service worker version automatically)
3. Push changes to master for dev deployment or release for prod deployment
4. Build and deploy changes (automatically done by CircleCI)
5. Clear cache of CDN if it is necessary (automatically done by CircleCI)
