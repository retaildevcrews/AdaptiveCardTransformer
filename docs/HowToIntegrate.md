# How to Integrate

## Getting started with the Adaptive Card Transformer

To use the `adaptive-card-transformer` you will need plugins, a `pluginConfig.json`, and a bot. To kickstart a project using the `adaptive-card-transformer`, leverage the Yeoman [generator-AdaptiveCardTransformer](https://github.com/retaildevcrews/generator-AdaptiveCardTransformer) to scaffold plugins, a `pluginConfig.json`, and an echo bot (if needed).

## Automatic Integration

1. If you do not have a bot, you can scaffold an echo bot with the [generator-AdaptiveCardTransformer](https://github.com/retaildevcrews/generator-AdaptiveCardTransformer).
1. After scaffolding the echo bot and selected plugins, the generator will prompt the user to overwrite certain files. This will automatically integrate the `adaptive-card-transformer` and plugins into the scaffolded echo bot.
1. Add logic and templates to your template-selector, pre-processor, and post-processor plugins. For an example, please refer to the [Adaptive Card Transformer Example Bot](https://github.com/retaildevcrews/AdaptiveCardTransformerExampleBot/tree/main/src)
1. Configure the `.npmrc` file in your project root and ensure your PAT token is populated (see the [Setup] section of the README for more info)
1. Run `npm install` to install all dependencies, including `adaptive-card-transformer`
1. Run `npm start` to run the echo bot with with the `adaptive-card-transformer`

[setup]: ../README.md#setup

## Manual Integration

If you already have a bot, follow these steps to integrate the `adaptive-card-transformer` into your bot:

1. In your bot project, scaffold plugins and the `pluginConfig.json` with the Yeoman [generator-AdaptiveCardTransformer](https://github.com/retaildevcrews/generator-AdaptiveCardTransformer).
1. Create the `.npmrc` file in your project root and ensure your PAT token is populated (see the [Setup] section of the README for more info)
1. Add dependency on the `adaptive-card-transformer` to your bot by running:

   ```bash
   npm install @retaildevcrews/adaptive-card-transformer
   ```

1. Import `cardFactory` from "botbuilder", `adapter` , and `pluginConfig.json` to your bot code (see below)

   ```ts
   import { CardFactory } from "botbuilder"
   import adapter from "@retaildevcrews/adaptive-card-transformer" // Adaptive Card Transformer Package
   import pluginConfig from "../plugins/pluginConfig.json"

   // invoke the adapter with each conversation payload and pluginConfig which identifies which plugins to use
   const cardJson = await adapter(conversationPayload, pluginConfig)

   // utilize the adaptive card factory to generate an activity attachment which is ready to be sent to the user (replied by the bot)
   const card = CardFactory.adaptiveCard(cardJson)
   ```

1. Call the adapter - pass in the `conversationPayload` and defined `pluginConfig` into the adapter.
1. Utilize the adaptive card factory to generate the activity attachment to be send to the user.
1. Run `npm start` to run your bot with with the `adaptive-card-transformer`
   - Note: If data is not rendering from the conversation payload to the bot correctly, consider modifying the existing templates, adding a custom template, or performing additional data mapping on the conversationPayload.

## Modifying Templates

To modify existing templates or build out new templates, please follow guidance in the [Template Design Guidance] documentation.

To add a new template to the Adaptive Card Transformer, please follow the guidance in the [How to Extend] documentation.

[how to extend]: ./HowToExtend.md

[Template Design Guidance]: [./TemplateDesignGuidance.md]
