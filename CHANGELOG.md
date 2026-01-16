# Changelog
All notable changes to this project will be documented in this file.

<a name="v4.1.0"></a>
## [v4.1.0](https://github.com/comunica/jQuery-Widget.js/compare/v4.0.1...v4.1.0) - 2026-01-16

### Added
* [Allow CONSTRUCT result format to be modified](https://github.com/comunica/jQuery-Widget.js/commit/29f2bd69c58f46a79ee12395a224ece3cb23735f)
* [Add pure SPARQL federation example queries for Uniprot](https://github.com/comunica/jQuery-Widget.js/commit/75828493b05771710bcd003fab5ce9e0f048e2e4)

<a name="v4.0.1"></a>
## [v4.0.1](https://github.com/comunica/jQuery-Widget.js/compare/v4.0.0...v4.0.1) - 2026-01-12

### Fixed
* [Fix default prefixes not being generated](https://github.com/comunica/jQuery-Widget.js/commit/eddc68f8dd21f67402f5c1c52762b8c96a09d5ec)

<a name="v4.0.0"></a>
## [v4.0.0](https://github.com/comunica/jQuery-Widget.js/compare/v3.0.2...v4.0.0) - 2026-01-08

### BREAKING CHANGE
* [Update to Comunica 5 and Traqula](https://github.com/comunica/jQuery-Widget.js/commit/c85e69583524bddbc0508a6df512af86856508b8)
    This removes 18 support.

<a name="v3.0.2"></a>
## [v3.0.2](https://github.com/comunica/jQuery-Widget.js/compare/v3.0.1...v3.0.2) - 2024-10-15

### Fixed
* [Revert "Fix duplicate queries.json file generation"](https://github.com/comunica/jQuery-Widget.js/commit/ae8de8031dc713d888c5d72c068c509646f48f2c)

<a name="v3.0.1"></a>
## [v3.0.1](https://github.com/comunica/jQuery-Widget.js/compare/v3.0.0...v3.0.1) - 2024-10-15

### Fixed
* [Fix move plugin not being packaged](https://github.com/comunica/jQuery-Widget.js/commit/719f4f8de78e1693f96e28ce4709c4327af478ef)

<a name="v3.0.0"></a>
## [v3.0.0](https://github.com/comunica/jQuery-Widget.js/compare/v2.0.0...v3.0.0) - 2024-10-15

### BREAKING CHANGES
* [Update to Comunica v4](https://github.com/comunica/jQuery-Widget.js/commit/4d9dcb1881d8a1d3ec24a8644d564451e53448b1)
  * Learn more on https://github.com/comunica/comunica/blob/master/CHANGELOG.md

<a name="v2.0.0"></a>
## [v2.0.0](https://github.com/comunica/jQuery-Widget.js/compare/v1.8.0...v2.0.0) - 2024-03-20

### Changed
* [Update to Comunica v3](https://github.com/comunica/jQuery-Widget.js/commit/f15ff13659506d10c240b2753e107d8527235885)

### Fixed
* [Fixed broken API key of geo widget](https://github.com/comunica/jQuery-Widget.js/commit/d74c81c2fadf25aace861bde7e0316333fb31830)
* [Fix logout crash if Solid profile is already in list of sources](https://github.com/comunica/jQuery-Widget.js/commit/35866d2394844be39068ea0a4450aed1fed0a5d8)
* [Fix double escaping of ampersands in URLs in execution log](https://github.com/comunica/jQuery-Widget.js/commit/d7a99ea15fe6bca50ba446da608501678608addc)

<a name="v1.8.0"></a>
## [v1.8.0](https://github.com/comunica/jQuery-Widget.js/compare/v1.7.1...v1.8.0) - 2023-03-28

### Added
* [Add baseURL parameter to support different hosts in Solid auth](https://github.com/comunica/jQuery-Widget.js/commit/c22ea7e7e4777a1c42893ff797fa74d222d174b8)

<a name="v1.7.1"></a>
## [v1.7.1](https://github.com/comunica/jQuery-Widget.js/compare/v1.7.0...v1.7.1) - 2023-02-15

### Fixed
* [Fix solid-client-id.json not being packaged](https://github.com/comunica/jQuery-Widget.js/commit/41c8c56756c3bf32490aee17f09b5329c2fc3d44)

<a name="v1.7.0"></a>
## [v1.7.0](https://github.com/comunica/jQuery-Widget.js/compare/v1.6.0...v1.7.0) - 2023-02-15

### Added
* [Add allowNoSources to settings to disable sources check](https://github.com/comunica/jQuery-Widget.js/commit/60a3e094c758622d94cd60b763b13af8c8160342)

### Changed
* [Update to Comunica 2.6.6](https://github.com/comunica/jQuery-Widget.js/commit/ca4396f3467b6f246d47ad7f9894f5428c487634)
* [Expose Solid client id, Closes #123](https://github.com/comunica/jQuery-Widget.js/commit/41986a7cef242cb1aaec39c7c1ef3e438bc7bcbd)
* [Add back Buffer global polyfill for jsonparser (#124)](https://github.com/comunica/jQuery-Widget.js/commit/049b4f3828338bfb0b11a998218c7e229513755a)
* [Update to new Inrupt IDP URL](https://github.com/comunica/jQuery-Widget.js/commit/8c0d46cc3daaaef903e065835a1441839e197e9e)

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
