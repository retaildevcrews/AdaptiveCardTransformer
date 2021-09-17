# How to Integrate

## How to integrate the Adaptive Card Transformer into your Bot

## Set up directory structure

- card-adapter
  - this is where you will move `./src` and rename `src` to `card-adapter`
  - templateTransformer (included)
- plugins
  - templateSelector (required)
  - pluginConfig.json (required)
  - pre Processor (optional)
  - post Processor (optional)
- bot
  - where you will import the adapter and plugins

## Integrate the Adaptive Card Transformer in your bot

1. Move the `./src` code into your `/card-adapter` directory (required)
1. Move the `./example/plugins/templateSelector` plugin into your `/plugins` directory (required)
1. If you want to use the Pre and Post Processor provided plugins in `./example/plugins`, add the plugin source code from `./example/plugins` to your `/plugins` directory (optional)
1. `npm install` all of the listed `dependencies` from the `package.json`
1. If needed, modify or add templates to `./plugins/templateSelector`. The provided templates may need to be customized to correctly map data from the conversation payload to the populated Adaptive Card. To add new templates or modify existing templates, please refer to the [modifying templates] section.
1. Configure your `templateSelector` plugin in `/plugins/templateSelector`:
   - The `templateSelector` requires that for each `cardTemplateType` a coresponding template exists in (`templateSelector/templates`)
   - Ensure your `/plugins/templateSelector/templateConfig.json` has the correct mappings of `cardTemplateType` to the template location.
1. If needed, modify your conversation payload:
   - If `cardTemplateType` does not exist on the conversation payload, add the field before passing the payload into the adapter.
   - Note: Additional mappings on the conversation payload may be necessary to ensure a successful transformation in the adapter.
1. Create a `pluginConfig.json` in your `/plugins` directory, and populate the config with the plugins and plugin location (template Selector is required, Pre and Post Processors are optional)
1. Import your `pluginConfig.json` to your bot code (see below)
1. Import the `adapter` to your bot code (see below)
1. Import `cardFactory` from "botbuilder" into your bot code (see below)

   ```ts
   import { CardFactory } from "botbuilder"
   import adapter from "../card-adapter/adapter" //Card Adapter Package
   import pluginConfig from "../plugins/pluginConfig.json"

   // invoke the adapter with each conversation payload and pluginConfig which identifies which plugins to use
   const cardJson = await adapter(conversationPayload, pluginConfig)

   // utilize the adaptive card factory to generate an activity attachment which is ready to be sent to the user (replied by the bot)
   const card = CardFactory.adaptiveCard(cardJson)
   ```

1. Call the adapter - pass in the conversationPayload and defined pluginConfig into the adapter.
1. Utilize the adaptive card factory to generate the activity attachment to be send to the user.
1. Run `npm start` to run your bot with with adapter.
   - Note: If data is not rendering from the conversation payload to the bot correctly, consider modifying the existing templates, adding a custom template, or performing additional data mapping on the conversationPayload.

[modifying templates]: #Modifying-Templates

## Modifying Templates

To modify existing templates or build out new templates, please follow guidance in the [Template Design Guidance] documentation.

To add a new template to the Adaptive Card Transformer, please follow the guidance in the [how to extend] documentation.

[how to extend]: ./docs/HowToExtend.md

[Template Design Guidance]: [./docs/TemplateDesignGuidance.md]

## Future packaging considerations

Future enhancements to this repo could include packaging `./src` into an npm package.

Once packaged, you no longer will need to move `./src` into your `card-adapter` directory and manually install the package dependencies. Rather, you could run `npm install adapter` to pull in all of the adapter source code.

Following installation of the adapter via the npm package, developers will still need to:

1. Move the required templateSelector plugin (from `./example/plugins/templateSelector`) into their `./plugins` directory
1. Modify or add templates if needed.
1. Create and supply the adapter with a `pluginConfig.json`
1. Supply and configure any additional desired plugins in the `pluginConfig.json`
