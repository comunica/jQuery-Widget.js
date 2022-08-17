# Changelog
All notable changes to this project will be documented in this file.

<a name="v1.6.0"></a>
## [v1.6.0](https://github.com/comunica/jQuery-Widget.js/compare/v1.5.4...v1.6.0) - 2022-08-17

### Changed
* [Include current protocol in default proxy, Closes #120](https://github.com/comunica/jQuery-Widget.js/commit/d7fcd74b6f03f935037026274cac08d76e328878)

<a name="v1.5.4"></a>
## [v1.5.4](https://github.com/comunica/jQuery-Widget/compare/v1.5.3...v1.5.4) - 2022-03-11

### Fixed
* [Add workaround for Solid name lookup conflict during link traversel](https://github.com/comunica/jQuery-Widget/commit/07923066cde8327ac5309b12bb9c1d4d094d1807)

<a name="v1.5.3"></a>
## [v1.5.3](https://github.com/comunica/jQuery-Widget/compare/v1.5.2...v1.5.3) - 2022-03-11

### Fixed
* [Fix query context not being passed when fetching Solid name](https://github.com/comunica/jQuery-Widget/commit/2ca958e47c651056efd063729b98cc970a0b4078)

<a name="v1.5.2"></a>
## [v1.5.2](https://github.com/comunica/jQuery-Widget/compare/v1.5.1...v1.5.2) - 2022-03-11

### Fixed
* [Ignore errors when loading Solid name](https://github.com/comunica/jQuery-Widget/commit/8f43224e930b9bf40da1139567f925b77b0a99c7)

<a name="v1.5.1"></a>
## [v1.5.1](https://github.com/comunica/jQuery-Widget/compare/v1.5.0...v1.5.1) - 2022-03-11

### Fixed
* [Fix Solid name loading not working anymore](https://github.com/comunica/jQuery-Widget/commit/bad732ad8d750a03607ec3a454a03bf7cf54190b)

<a name="v1.5.0"></a>
## [v1.5.0](https://github.com/comunica/jQuery-Widget/compare/v1.4.0...v1.5.0) - 2022-03-03

### Changed
* [Update to Comunica 2](https://github.com/comunica/jQuery-Widget/commit/9e6df729e1788dd989af20843281c1bafaa44261)
* [Reduce bundle size by using smaller Turf package](https://github.com/comunica/jQuery-Widget/commit/b7be9a10face5d426fbc5abde207d2dab39e341f)

<a name="v1.4.0"></a>
## [v1.4.0](https://github.com/comunica/jQuery-Widget/compare/v1.3.2...v1.4.0) - 2022-01-11

### Added

* Add Solid authentication support

<a name="v1.3.2"></a>
## [v1.3.2](https://github.com/comunica/jQuery-Widget/compare/v1.3.1...v1.3.2) - 2021-09-30

### Changed
* [Update Comunica monorepo packages to v1.22.0 (#98)](https://github.com/comunica/jQuery-Widget/commit/cd1104c4fd7fea1615538e637dbf58d39f87c5a9)

### Fixed
* [Fix crash when building from globally installed module, Closes #99](https://github.com/comunica/jQuery-Widget/commit/37f573a6113d395806a0b80b1fa61acd98d094d6)

<a name="v1.3.1"></a>
## [v1.3.1](https://github.com/comunica/jQuery-Widget/compare/v1.3.0...v1.3.1) - 2021-07-19

### Fixed
* [Fix display issues with map](https://github.com/comunica/jQuery-Widget/commit/bd4dfbd16cb91228c0356ef3617324ba8f96bd04)

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
