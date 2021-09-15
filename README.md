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

## Usage

To use the adapter, simply import the [adapter package] and pass in the [conversation payload] and [plugin configuration]. The result will be the Adaptive Card JSON which can be transformed into a [botbuilder] activity card response via `CardFactory`.

_Note: the developer is responsible for providing the plugins, plugin configuration file, and Adaptive Card templates which are described below._

To integrate the Adaptive Card Transformer into your bot, please follow the guidance in the [how to integrate] documentation.

```ts
import { CardFactory } from "botbuilder"
import adapter from "../../src/adapter" //Card Adapter Package
import pluginConfig from "./pluginConfig.json"

// invoke the adapter with each conversation payload and pluginConfig which identifies which plugins to use
const cardJson = await adapter(conversationPayload, pluginConfig)

// utilize the adaptive card factory to generate an activity attachment which is ready to be sent to the user (replied by the bot)
const card = CardFactory.adaptiveCard(cardJson)
```

[conversation payload]: #Conversation-Payload
[plugin configuration]: #Plugin-Configuration
[botbuilder]: https://github.com/microsoft/botframework-sdk
[adapter package]: ./src
[how to integrate]: ./docs/HowToIntegrate.md

## Design Principles

The Adaptive Card Transformer relies on a few concepts which are described in this section.

### Conversation Payload

The conversation payload is generally the data which drives the conversation responses. Many chatbots use an API service to facilitate Natural Language Understanding (NLU) and/or dialog flow logic. This payload should contain all of the necessary data to construct the desired Adaptive Card experience for the end user.

The example [DocBot] utilizes the [example API] as a backend service which facilitates conversation state and flow. It is a simple example, but illustrates one possible implementation using the `cardTemplateType` property. This property identifies which Adaptive Card template DocBot should utilize when responding to the user.

[docbot]: ./example/bot
[example api]: ./example/api

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
[pluginconfig interface]: ./src/adapter/index.ts
[example pluginconfig]: ./example/bot/pluginConfig.json

### Plugins and Their Stages

The Adaptive Card Transformer has four stages which are described in this section. Three of the four are customizable plugins which are provided by the developers and consumed by the adapter.

| Order | Stage          | Provided by | Plugin Required |
| :---: | -------------- | ----------- | :-------------: |
|   1   | Selector       | developer   |       yes       |
|   2   | Pre Processor  | developer   |       no        |
|   3   | Transformer    | adapter     |       n/a       |
|   4   | Post Processor | developer   |       no        |

#### [Selector] (required)

Required plugin which determines which Adaptive Card template to use given the conversation payload. This stage uses the conversation payload to identify the most appropriate template. It assumes that there are Adaptive Card templates available to select from (see the [example selector templates]).

The example Selector `.example/templateSelector` returns the appropriate template based on the `cardTemplateType` field in the conversation Payload. For every `cardTemplateType`, there must be a corresponding template in the [example selector templates] directory.

If there is not a corresponding template, the adapter will throw an exception to the bot.

To add more templates to the selector, please refer to the [how to extend] documentation.

[selector]: ./example/plugins/templateSelector/index.js
[example selector templates]: ./example/plugins/templateSelector/templates
[how to extend]: ./docs/HowToExtend.md

#### [Pre Processor] (optional)

Optional plugin which enables the developer to manipulate the conversation payload or perform any logic which prepares the data before being used to create the Adaptive Card response in the next stage.

For example, if the conversation payload we've received contains any fields that need to be manipulated to support a successful transformation into populated Adaptive Card, we would want to leverage the Pre Processor plugin.

The Pre Processor plugin requires that the conversation payload and selected template are provided. Additionally, the Pre Processor only returns the manipulated conversation payload.

[pre processor]: ./example/plugins/preProcessor/index.js

#### [Transformer] (provided by the adapter)

The Transformer stage is provided by the adapter. It combines the data from the conversation payload with the Adaptive Card template to produce the transformed (populated) Adaptive Card.

The Transformer leverages the [adaptivecards-templating](https://docs.microsoft.com/en-us/adaptive-cards/templating/sdk) library, which implements a JSON-to-JSON templating/data-binding engine, to transform the conversation payload into the populated Adaptive Card.

[transformer]: ./src/adapter/templateTransformer.ts

#### [Post Processor] (optional)

Optional plugin which enables the developer to manipulate the transformed Adaptive Card before it is returned to the bot.

In the last stage of the adapter, the Post Processor supports any final manipulation to the populated Adaptive Card. It requires the conversation payload, selected template, as well as the populated Adaptive Card as inputs, and returns only the manipulated Adaptive Card.

[post processor]: ./example/plugins/postProcessor/index.js

### Extensibility

To add a new template to the Adaptive Card Transformer, please follow the guidance in the [how to extend] documentation.

[how to extend]: ./docs/HowToExtend.md

## Development Bot

To run the Adaptive Card Transformer in a development bot, please refer to the [example README.md]. The [example directory] supplies an example bot ([DocBot]), an [example API] as a backend service to facilitate conversation state and flow, as well as [example plugins] for the Adaptive Card Transformer to load and utilize.

[example directory]: ./example
[example readme.md]: ./example/README.md
[docbot]: ./example/bot
[example api]: ./example/api
[example plugins]: ./example/plugins

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

- The Adaptive Card Transformer has a [loggingService] which leverages Winston, a simple and universal logging library with support for multiple transports. In the [loggingService], log levels, colors, log format, and transports can be customized and implemented globally by creating a logging instance for each new service or module.

- The [example bot logging], [example api logging], and the Adaptive Card Transformer [logging] all leverage the loggingService. To create an instance of the loggingService for a new service or module, simply leverage the createLogger method exported by the [loggingService]:

```typescript
const Logger = createLogger("module_name_here")
```

- Currently, the loggingService only implements a transport to print logs to the console. However, Winston offers support for a plethora of targets for your logs. For example, you can leverage the 'winston-application-insights-transport' library, add an App Insights Transport to your logger, and push Logs directly to App insights.

- Winston also provides a simple extensibility mechanism for any custom Transports that are not provided. You can use other HTTP transport methods to push logs to any other supported monitoring systems. For example, you can create a logging transport to data dog:

```typescript
Agentless Logging tranport via http
const httpTransportOptions = {
host: "http-intake.logs.datadoghq.com",
path: "/v1/input/<APIKEY>?ddsource=nodejs&service=<APPLICATION_NAME>",
ssl: true,
}
```

- Winston also supports log collection via an agent. By using an agent (such as OpenTelemetry), you can send all of you logs and monitoring data to one agent, and export to multiple different backends such as: datadog, azure monitor, app insights, jaeger, or prometheus for monitoring.

[loggingservice]: ./src/adapter/loggingService.ts
[example bot logging]: ./example/bot/logging.ts
[example api logging]: ./example/api/logging.ts
[logging]: ./src/adapter/logger.ts

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
