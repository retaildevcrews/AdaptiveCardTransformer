# Adaptive Card Transformer

[![CI](https://github.com/retaildevcrews/wd-bot/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/retaildevcrews/wd-bot/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/license-MIT-green.svg)

The Adaptive Card Transformer is an easy-to-use adapter which enables data driven conversations to utilize [Adaptive Card] functionality with an extendable plugin pattern. The adapter has a data pipeline that consists of [four stages], three of which are provided by the user. These stages provide the developer ample hooks to manipulate the payloads and implement logic which dictates how the adapter will perform.

_Note: the [Plugins] section describes the stages in more detail - not all stages are required._

A plugin style architecture is used which allows developers to leverage their own plugin code to have full control over the adapter's behavior.

This pattern aims to promote flexibility, reusability and extensibility of different Adaptive Card templates and plugins across development teams. The [Design Principles] section goes into more details.

[adaptive card]: https://docs.microsoft.com/en-us/adaptive-cards/
[plugins]: #Plugins-and-Their-Stages
[design principles]: #Design-Principles
[four stages]: #Plugins-and-Their-Stages

## Setup

This package is currently available as a private GitHub package. Before installing, you will need to:

- Create a new Personal Access Token on GitHub

  - To create a new token, follow [this guide](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)

  - You will only need to set the [`read:packages`](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages#about-scopes-and-permissions-for-package-registries) scope for the token

- Configure a `.npmrc` file in your project's root directory

  - Copy the [`.npmrc.example`](./.npmrc.example) template file for your own `.npmrc` and replace `TOKEN` with your appropriate Personal Access Token

## Usage

To use the adapter, install the [`adaptive-card-transformer`](https://github.com/retaildevcrews/AdaptiveCardTransformer/packages/1000147) package, call `adapter()` and pass in the [conversation payload] and [plugin configuration]. The result will be the Adaptive Card JSON which can be transformed into a [botbuilder] activity card response via `CardFactory`.

_Note: the developer is responsible for providing the plugins, plugin configuration file, and Adaptive Card templates which are described below._

To integrate the Adaptive Card Transformer into your bot, please follow the guidance in the [how to integrate] documentation.

```ts
import { CardFactory } from "botbuilder"
import adapter from "@retaildevcrews/adaptive-card-transformer" // Card Adapter Package
import pluginConfig from "./pluginConfig.json"

// invoke the adapter with each conversation payload and pluginConfig which identifies which plugins to use
const cardJson = await adapter(conversationPayload, pluginConfig)

// utilize the adaptive card factory to generate an activity attachment which is ready to be sent to the user (replied by the bot)
const card = CardFactory.adaptiveCard(cardJson)
```

[conversation payload]: #Conversation-Payload
[plugin configuration]: #Plugin-Configuration
[botbuilder]: https://github.com/microsoft/botframework-sdk
[how to integrate]: ./docs/HowToIntegrate.md

## Design Principles

The Adaptive Card Transformer relies on a few concepts which are described in this section.

### Conversation Payload

The conversation payload is generally the data which drives the conversation responses. Many chatbots use an API service to facilitate Natural Language Understanding (NLU) and/or dialog flow logic. This payload should contain all of the necessary data to construct the desired Adaptive Card experience for the end user.

The example [DocBot] utilizes the [example API] as a backend service which facilitates conversation state and flow. It is a simple example, but illustrates one possible implementation using the `cardTemplateType` property. This property identifies which Adaptive Card template DocBot should utilize when responding to the user.

[docbot]: https://github.com/retaildevcrews/wd-bot/tree/main/src/bot
[example api]: https://github.com/retaildevcrews/wd-bot/tree/main/src/api

### Plugin Configuration

The configuration file provides the adapter details on which plugins to utilize as well as where to find them. Plugins are covered more in the next section, but note that this configuration is a required argument for the adapter.

- The `PackageName` properties must match the plugin's package `name` property (found in `package.json`)
- The `InstallPath` properties are relative paths from the root of the project

_Note: each of the three plugins have their own respective set of `PackageName` and `InstallPath`._

- The `forceReinstall` property applies to all plugins
  - Signals to the plugin loader if the plugin package should be reinstalled even if a package already exists or has been pre-installed
  - Refer to [PluginManager docs] for more information

See [PluginConfig interface] and provided [example pluginConfig].

[pluginmanager docs]: https://github.com/davideicardi/live-plugin-manager
[pluginconfig interface]: ./src/index.ts
[example pluginconfig]: https://github.com/retaildevcrews/wd-bot/blob/main/src/bot/pluginConfig.json

### Plugins and Their Stages

The Adaptive Card Transformer has four stages which are described in this section. Three of the four are customizable plugins which are provided by the developers and consumed by the adapter.

| Order | Stage          | Provided by | Plugin Required |
| :---: | -------------- | ----------- | :-------------: |
|   1   | Selector       | developer   |       yes       |
|   2   | Pre Processor  | developer   |       no        |
|   3   | Transformer    | adapter     |       n/a       |
|   4   | Post Processor | developer   |       no        |

#### [Template Selector] (required)

Required plugin which determines which Adaptive Card template to use given the conversation payload. This stage uses the conversation payload to identify the most appropriate template. It assumes that there are Adaptive Card templates available to select from (see the [example selector templates]).

The example `templateSelector` returns the appropriate template based on the `cardTemplateType` field in the conversation Payload. For every `cardTemplateType`, there must be a corresponding template in the [example selector templates] directory.

If there is not a corresponding template, the adapter will throw an exception to the bot.

To add more templates to the selector, please refer to the [how to extend] documentation.

[template selector]: https://github.com/retaildevcrews/wd-bot/tree/main/src/plugins/templateSelector
[example selector templates]: https://github.com/retaildevcrews/wd-bot/tree/main/src/plugins/templateSelector/templates
[how to extend]: ./docs/HowToExtend.md

#### [Pre Processor] (optional)

Optional plugin which enables the developer to manipulate the conversation payload or perform any logic which prepares the data before being used to create the Adaptive Card response in the next stage.

For example, if the conversation payload we've received contains any fields that need to be manipulated to support a successful transformation into populated Adaptive Card, we would want to leverage the Pre Processor plugin.

The Pre Processor plugin requires that the conversation payload and selected template are provided. Additionally, the Pre Processor only returns the manipulated conversation payload.

[pre processor]: https://github.com/retaildevcrews/wd-bot/tree/main/src/plugins/preProcessor

#### [Template Transformer] (provided by the adapter)

The Transformer stage is provided by the adapter. It combines the data from the conversation payload with the Adaptive Card template to produce the transformed (populated) Adaptive Card.

The Transformer leverages the [adaptivecards-templating](https://docs.microsoft.com/en-us/adaptive-cards/templating/sdk) library, which implements a JSON-to-JSON templating/data-binding engine, to transform the conversation payload into the populated Adaptive Card.

[template transformer]: ./src/templateTransformer.ts

#### [Post Processor] (optional)

Optional plugin which enables the developer to manipulate the transformed Adaptive Card before it is returned to the bot.

In the last stage of the adapter, the Post Processor supports any final manipulation to the populated Adaptive Card. It requires the conversation payload, selected template, as well as the populated Adaptive Card as inputs, and returns only the manipulated Adaptive Card.

[post processor]: https://github.com/retaildevcrews/wd-bot/tree/main/src/plugins/postProcessor

### Extensibility

To add a new template to the Adaptive Card Transformer, please follow the guidance in the [how to extend] documentation.

[how to extend]: ./docs/HowToExtend.md

## Development Bot

To run the Adaptive Card Transformer in a development bot, please refer to the [sample bot repo](https://github.com/retaildevcrews/wd-bot/tree/main). The sample bot repo supplies an example Teams bot ([DocBot](https://github.com/retaildevcrews/wd-bot/tree/main/src/bot)), an [example API](https://github.com/retaildevcrews/wd-bot/tree/main/src/api) as a backend service to facilitate conversation state and flow, as well as [example plugins](https://github.com/retaildevcrews/wd-bot/tree/main/src/plugins) for the Adaptive Card Transformer to load and utilize.

## Scripts and CI

Our CI tools run Eslint, Shellcheck, Markdownlint and Woke. Our CI tools can be run locally via a bash script as well as upstream via Git Actions.

[Woke](https://github.com/get-woke/woke) is a linting tool used to detect non-inclusive language in your source code and recommends alternative terms to use. A "ruleset" (a yaml file) defines the terms that woke will lint for. In `./scripts/run-ci.sh`, we are running woke with woke's default ruleset, which lints for non-inclusive terms throughout the source code.

## Testing

This project leverages [ts-jest](https://www.npmjs.com/package/ts-jest) on top of [Jest](https://jestjs.io/) for unit testing. This provides all the benefits of Jest (simplicity, rich functionality, built-in code coverage metrics) along with the complete TypeScript support of `ts-jest` (type-checking).

To run unit tests in the project, run

```sh
npm test # run all unit tests

npm test -- SomeTestFile # run unit tests in SomeTestFile

npm run test-coverage # run all unit tests with code coverage report
```

## Logging

- For logging, the Adaptive Card Transformer leverages [`debug`](https://www.npmjs.com/package/debug), a small and simple debugging utility frequently used in NPM packages. One of the biggest benefits to using `debug` is that it avoids polluting the logs of any application using the adapter. These logs are mainly intended for debugging purposes and so they will only be enabled when the `DEBUG` environment variable is set while running your application:

  ```sh
  # enable logs from all adapter namespaces
  $ DEBUG=adapter:* node app/entrypoint.js

  # only enable logs from adapter:pluginLoader namespace
  $ DEBUG=adapter:pluginLoader node app/entrypoint.js
  ```

- To create an instance of the debug logger for a new service or module, it's as simple as instantiating the logger in the given module with an appropriate namespace and just using it:

  ```ts
  import debug from "debug"

  // this will prefix log messages with "adapter:module_name_here"
  const log = debug("adapter:module_name_here")

  log("This is a test log message")
  ```

- One more thing to note about `debug` is that it can only log to `stderr` or `stdout` (by default it logs everything to `stderr`, but can be configured). There are also other configurable options via setting additional environment variables (e.g. colors, timestamps). See more information on all of this and more in the `debug` package [docs](https://www.npmjs.com/package/debug).

## Engineering Docs

- Team Working [Agreement](docs/WorkingAgreement.md)
- Team [Engineering Practices](docs/EngineeringPractices.md)
- CSE Engineering Fundamentals [Playbook](https://github.com/Microsoft/code-with-engineering-playbook)

## How to file issues and get help

This project uses GitHub Issues to track bugs and feature requests. Please search the existing issues before filing new issues to avoid duplicates. For new issues, file your bug or feature request as a new issue.

For help and questions about using this project, please open a GitHub issue.

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For details, visit <https://cla.opensource.microsoft.com>

When you submit a pull request, a CLA bot will automatically determine whether you need to provide a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services.

Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).

Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.

Any use of third-party trademarks or logos are subject to those third-party's policies.
