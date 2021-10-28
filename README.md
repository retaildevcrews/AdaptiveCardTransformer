# Adaptive Card Transformer

## Problem Summary

Using the Bot Framework, one generally builds the intelligence directly into the bot.  By doing so developers can use the Bot Framework’s channel capabilities to automatically support each of the Bot Framework’s supported platforms (e.g., Facebook, Teams, Web chat).  

Sometimes organizations want to ensure that the intelligence and capabilities of their bots reside in their middleware and backend systems to create opportunities for reuse, standardization and centralization of business rules and capabilities.  Such organizations develop their own  Natural Language Understanding (NLU), dialog flow and system orchestration capabilities that sit in their middleware or backend systems.  While relying on their own NLU technologies, such organizations still want to make use of the Bot Framework as a consumer of the output of their systems to leverage Adaptive Cards and render the bot in Teams. The Bot Framework doesn’t natively support conversation driven by data from backend systems, but the Adaptive Card Transformer described below adds these capabilities.

## Solution Summary 
[![CI](https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/license-MIT-green.svg)

The `adaptive-card-transformer` is an easy-to-use adapter which enables data driven conversations to utilize [Adaptive Cards] functionality with an extendable plugin pattern. The purpose of the adapter is to allow easy consumption of conversation payloads. An example of this is when the chatbot leverages a backend service to control the conversation flow.

The adapter has a data pipeline that consists of [four stages], three of which are provided by the user. These stages provide the developer ample hooks to manipulate the payloads and implement logic which dictates how the adapter will perform.

_Note: the [Plugins] section describes the stages in more detail - not all stages are required._

A plugin style architecture is used which allows developers to leverage their own plugin code to have full control over the adapter's behavior.

This pattern aims to promote flexibility, reusability and extensibility of different Adaptive Card templates and plugins across development teams. The [Design Principles] section goes into more details.

[adaptive cards]: https://docs.microsoft.com/en-us/adaptive-cards/
[four stages]: #Plugins-and-Their-Stages
[plugins]: #Plugins-and-Their-Stages
[design principles]: #Design-Principles

## Related Projects

There are three related repositories for the `adaptive-card-transformer`:

- [AdaptiveCardTransformer] (this repository) - The easy-to-use adapter enabling back-end NLU responses to be rendered through Adaptive Card functionality with an extendable plugin pattern

- [AdaptiveCardTransformerExampleBot] - The Teams bot example implementation that uses the `adaptive-card-transformer`

- [generator-AdaptiveCardTransformer] - The Yeoman generator for scaffolding plugins using the `adaptive-card-transformer`

[adaptivecardtransformer]: https://github.com/retaildevcrews/AdaptiveCardTransformer
[adaptivecardtransformerexamplebot]: https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot
[generator-adaptivecardtransformer]: https://github.com/retaildevcrews/generator-AdaptiveCardTransformer

## Setup

This package is currently available as a public GitHub package. Before installing, you will need to explicitly reference the GitHub package registry and fill in the auth token with your own GitHub Personal Access Token (PAT):

- To create a GitHub PAT token, follow [this guide]

  - To use the `adaptive-card-transformer` package, you will only need to set the [`read:packages`] scope for the token

- Configure a `.npmrc` file in your project's root directory

  - Copy the [`.npmrc.example`] template file for your own `.npmrc`

  - Replace `TOKEN` in the newly created `.npmrc` with your own created token:

    ```sh
    //npm.pkg.github.com/:_authToken=TOKEN
    @retaildevcrews:registry=https://npm.pkg.github.com
    ```

- Install `adaptive-card-transformer` by running:

  ```sh
  npm install @retaildevcrews/adaptive-card-transformer
  ```

[this guide]: https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token
[`read:packages`]: https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages#about-scopes-and-permissions-for-package-registries
[`.npmrc.example`]: ./.npmrc.example

## Usage

To use the adapter, install the [`adaptive-card-transformer`] package, call `adapter()` and pass in the [conversation payload] and [plugin configuration]. The result will be the Adaptive Card JSON which can be transformed into a [botbuilder] activity card response via `CardFactory`.

_Note: the developer is responsible for providing the plugins, plugin configuration file, and Adaptive Card templates which are described below._

To integrate the Adaptive Card Transformer into your bot, please follow the guidance in the [How to Integrate] documentation.

```ts
import { CardFactory } from "botbuilder"
import adapter from "@retaildevcrews/adaptive-card-transformer" // Card Adapter Package
import pluginConfig from "./pluginConfig.json"

// invoke the adapter with each conversation payload and pluginConfig which identifies which plugins to use
const cardJson = await adapter(conversationPayload, pluginConfig)

// utilize the adaptive card factory to generate an activity attachment which is ready to be sent to the user (replied by the bot)
const card = CardFactory.adaptiveCard(cardJson)
```

[`adaptive-card-transformer`]: https://github.com/retaildevcrews/AdaptiveCardTransformer/packages/1000147
[conversation payload]: #Conversation-Payload
[plugin configuration]: #Plugin-Configuration
[botbuilder]: https://github.com/microsoft/botframework-sdk
[how to integrate]: ./docs/HowToIntegrate.md

## Design Principles

The Adaptive Card Transformer relies on a few concepts which are described in this section.

_Note: This section references a separate sample bot repository ([AdaptiveCardTransformerExampleBot]) that includes an example DocBot, backend API, and plugins. This sample DocBot simulates a doctor's appointment scheduler use case and makes use of the `adaptive-card-transformer` package._

[adaptivecardtransformerexamplebot]: https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot

### Conversation Payload

The conversation payload is generally the data which drives the conversation responses. Many chatbots use an API service to facilitate Natural Language Understanding (NLU) and/or dialog flow logic. This payload should contain all of the necessary data to populate the desired Adaptive Card for the end user.

The sample [DocBot] utilizes its [sample API] as a backend service which facilitates conversation state and flow. It is a simple example, but illustrates one possible implementation using a required `cardTemplateType` property. This property identifies which Adaptive Card template DocBot should utilize when responding to the user.

[docbot]: https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot/tree/main/src/bot
[sample api]: https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot/tree/main/src/api

### Plugin Configuration

The plugin configuration file provides the adapter details on which plugins to utilize as well as where to find them. Plugins are covered more in the next section, but note that this configuration is a required argument for the adapter.

- The `PackageName` properties must match the plugin's package `name` property (found in `package.json`)
- The `InstallPath` properties are relative paths from the root of the project

_Note: each of the three plugins have their own respective set of `PackageName` and `InstallPath`._

- The `forceReinstall` property applies to all plugins
  - Signals to the plugin loader that the plugin package should be reinstalled if a package already exists or has been pre-installed
  - Refer to [PluginManager docs] for more information

See the provided [PluginConfig interface] and the sample DocBot's [pluginConfig file].

[pluginmanager docs]: https://github.com/davideicardi/live-plugin-manager
[pluginconfig interface]: ./src/index.ts
[pluginconfig file]: https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot/blob/main/src/bot/pluginConfig.json

### Plugins and Their Stages

The Adaptive Card Transformer has four stages which are described in this section. Three of the four are customizable plugins which are provided by the developers and consumed by the adapter.

| Order | Stage             | Provided by | Plugin Required |
| :---: | ----------------- | ----------- | :-------------: |
|   1   | Template Selector | developer   |       yes       |
|   2   | Pre Processor     | developer   |       no        |
|   3   | Transformer       | adapter     |        -        |
|   4   | Post Processor    | developer   |       no        |

#### **1. Template Selector** (required)

Required plugin which determines which Adaptive Card template to use given the conversation payload. This stage uses the conversation payload to identify the most appropriate template. It assumes that there are Adaptive Card templates available to select from (see the sample [card templates]).

_Example implementation:_

- The sample `templateSelector` returns the appropriate template based on a `cardTemplateType` field in the conversation payload. For every `cardTemplateType`, there is a corresponding template in the sample repo's card templates directory.

  If there is not a corresponding template, the adapter throws an exception to the bot.

_Extensibility:_

- To add more templates to the selector, please refer to the [how to extend] documentation. To see the sample `templateSelector` plugin in use, see DocBot [here](https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot/tree/main/src/plugins/templateSelector).

[card templates]: https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot/tree/main/src/plugins/templateSelector/templates
[how to extend]: ./docs/HowToExtend.md

#### **2. Pre Processor** (optional)

Optional plugin which enables the developer to manipulate the conversation payload or perform any logic which prepares the data before being used to create the Adaptive Card in the next stage.

_Usage:_

- If the conversation payload we've received contains fields that need to be manipulated to support a successful transformation into a populated Adaptive Card, we would want to leverage the Pre Processor plugin.

  The Pre Processor plugin requires that the conversation payload and selected template are provided. Additionally, the Pre Processor only returns the manipulated conversation payload.

To see more about the sample `preProcessor` plugin in DocBot, see [here](https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot/tree/main/src/plugins/preProcessor).

#### **3. Transformer** (provided by this adapter)

The Transformer stage is provided by the adapter. It combines the data from the conversation payload with the Adaptive Card template to produce the transformed (populated) Adaptive Card.

The Transformer leverages the [adaptivecards-templating](https://docs.microsoft.com/en-us/adaptive-cards/templating/sdk) library, which implements a JSON-to-JSON templating/data-binding engine, to transform the conversation payload into the populated Adaptive Card.

To see more about the `templateTransformer` plugin provided by this adapter, see [here](./src/templateTransformer.ts).

#### **4. Post Processor** (optional)

Optional plugin which enables the developer to manipulate the populated Adaptive Card before it is returned to the bot (caller of the adapter).

_Note: The adapter does not send any response directly to the user. That is the responsibility of the bot._

_Usage:_

- In the last stage of the adapter, the Post Processor supports any final manipulation to the populated Adaptive Card. It requires the conversation payload, selected template, as well as the populated Adaptive Card as inputs, and returns only the manipulated Adaptive Card.

To see more about the sample `postProcessor` plugin in DocBot, see [here](https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot/tree/main/src/plugins/postProcessor).

## Development Bot

To run the Adaptive Card Transformer in a development bot, please refer to the [sample bot repo]. The sample bot repo supplies an example Teams bot ([DocBot]), an [example API] as a backend service to facilitate conversation state and flow, as well as [example plugins] for the Adaptive Card Transformer to load and utilize.

[sample bot repo]: https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot/tree/main
[docbot]: https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot/tree/main/src/bot
[example api]: https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot/tree/main/src/api
[example plugins]: https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot/tree/main/src/plugins

## Scripts and CI

Our CI tools run Eslint, Shellcheck, Markdownlint and Woke. They can be run locally via a bash script as well as upstream via Git Actions.

[Woke] is a linting tool used to detect non-inclusive language in your source code and recommends alternative terms to use. A "ruleset" (a yaml file) defines the terms that woke will lint for. In `./scripts/run-ci.sh`, we are running woke with woke's default ruleset, which lints for non-inclusive terms throughout the source code.

[woke]: https://github.com/get-woke/woke

## Testing

This project leverages [ts-jest] on top of [Jest] for unit testing. This provides all the benefits of Jest (simplicity, rich functionality, built-in code coverage metrics) along with the complete TypeScript support of `ts-jest` (type-checking).

[ts-jest]: https://www.npmjs.com/package/ts-jest
[jest]: https://jestjs.io/

To run unit tests in the project, run

```sh
npm test # run all unit tests

npm test -- SomeTestFile # run unit tests in SomeTestFile

npm run test-coverage # run all unit tests with code coverage report
```

## Logging

For logging, the Adaptive Card Transformer leverages [`debug`], a small and simple debugging utility frequently used in NPM packages. One of the biggest benefits to using `debug` is that it avoids polluting the logs of any application using the adapter. These logs are mainly intended for debugging purposes and so they will only be enabled when the `DEBUG` environment variable is set while running your application:

```sh
# enable logs from all adapter namespaces
$ DEBUG=adapter:* node app/entrypoint.js

# only enable logs from adapter:pluginLoader namespace
$ DEBUG=adapter:pluginLoader node app/entrypoint.js
```

To create an instance of the debug logger for a new service or module, it's as simple as instantiating the logger in the given module with an appropriate namespace and just using it:

```ts
import debug from "debug"

// this will prefix log messages with "adapter:module_name_here"
const log = debug("adapter:module_name_here")

log("This is a test log message")
```

One more thing to note about `debug` is that it can only log to `stderr` or `stdout` (by default it logs everything to `stderr`, but can be configured). There are also other configurable options via setting additional environment variables (e.g. colors, timestamps). See more information on all of this and more in the [`debug`] docs.

[`debug`]: https://www.npmjs.com/package/debug

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

### Package Version Management

Package version management is handled automatically by the [CI-CD pipeline](./.github/workflows/ci-cd.yml) using [this github action](https://github.com/phips28/gh-action-bump-version). The workflow and commit triggers for major and minor versions can be found [here](https://github.com/phips28/gh-action-bump-version#workflow).

## Trademarks

This project may contain trademarks or logos for projects, products, or services.

Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).

Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.

Any use of third-party trademarks or logos are subject to those third-party's policies.
