# Changelog
All notable changes to this project will be documented in this file.

<a name="v1.3.0"></a>
## [v1.3.0](https://github.com/comunica/jQuery-Widget/compare/v1.2.1...v1.3.0) - 2021-07-19

### Added
* [Allow page title to be configured](https://github.com/comunica/jQuery-Widget/commit/802fe54540bd76daa965b9661afed04d7b730e7b)
* [Allow map settings to be changed](https://github.com/comunica/jQuery-Widget/commit/5fe3e94f38bca23533daaf0890ca91a19abb1f2d)

<a name="v1.2.1"></a>
## [v1.2.1](https://github.com/comunica/jQuery-Widget/compare/v1.2.0...v1.2.1) - 2021-07-01

### Fixed
* [Clear map upon each new query, Closes #89](https://github.com/comunica/jQuery-Widget/commit/6117380bd7cf47bfe764a8bac45b7dd1c77cd7ef)
* [Slightly improve map performance by not always showing popups, #90](https://github.com/comunica/jQuery-Widget/commit/6147d3a300f6eed54f7a9002a64e43a707a3ff85)

<a name="v1.2.0"></a>
## [v1.2.0](https://github.com/comunica/jQuery-Widget/compare/v1.1.1...v1.2.0) - 2021-06-29

### Added
* [Added a geo-widget](https://github.com/comunica/jQuery-Widget/commit/76898edbb3f8b97ae8f9e7b23c5ea9935bdd99db)

### Changed
* [Update dependency @comunica/actor-init-sparql to v1.21.3](https://github.com/comunica/jQuery-Widget/commit/a7377b678e40d8e87ef5df937a34b335adc0b208)

<a name="v1.1.1"></a>
## [v1.1.1](https://github.com/comunica/jQuery-Widget/compare/v1.1.0...v1.1.1) - 2021-04-12

### Fixed
* [Fix Comunica version string loader not working from external builds](https://github.com/comunica/jQuery-Widget/commit/4f1529103cbd6f8f2306b448f4583aabf4d2b1e9)

<a name="v1.1.0"></a>
## [v1.1.0](https://github.com/comunica/jQuery-Widget/compare/v1.0.0...v1.1.0) - 2021-04-12

### Added
* [Allow sources to be defined as relative URL, Closes #52](https://github.com/comunica/jQuery-Widget/commit/ee4eb64566ef05d525d57a2e9ec8a36645dd996c)
* [Make LDF-hosted datasource URLs relative to scheme, #52](https://github.com/comunica/jQuery-Widget/commit/825afb11918dd1dae9ba16cd21832013e1d7073e)
* [Allow default context entries to be passed](https://github.com/comunica/jQuery-Widget/commit/28a8505a49def05657fee222043fe598788292d2)
* [Allow customizing of branding via settings.json](https://github.com/comunica/jQuery-Widget/commit/8b7ef24249210c4aacd0e664c295a2502c3ae26a)

### Changed
* [Modernize branding](https://github.com/comunica/jQuery-Widget/commit/5428875be35c4cdc5387f9adcf8bf4b8514a9f10)

### Fixed
* [Fix broken dev-prod script](https://github.com/comunica/jQuery-Widget/commit/5cfc43c040a230f2d0e6ca4d08c026a30f610a42)
* [Fix queries still running after pressing stop, Closes #66](https://github.com/comunica/jQuery-Widget/commit/fe122f07d756ad7b0c6eb484c3fff3365a178972)
* [Fix incorrect path to queries.json in webpack config](https://github.com/comunica/jQuery-Widget/commit/f2aff8688c1a684537e9dcb97bd4ca5b382000bc)
* [Fix default datasource not being set if not listed first](https://github.com/comunica/jQuery-Widget/commit/f50574504eceb08218d676f54f96d944543f9794)

<a name="v1.0.0"></a>
## [v1.0.0] - 2021-04-02

Initial npm release as generator
