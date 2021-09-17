# How to extend

## How to add new templates

To add a new template a developer simply needs to:

1. Create and add the new template json file in `<project>/plugins/templateSelector/templates` directory

2. Add a reference to the template location and corresponding field that will be used to identify the template in the `<project>/plugins/templateSelector/templateConfig.json`

3. Ensure the NLU engine outputs the corresponding `templateType` field in the received responses or add custom code for this in the `plugin/preProcessor`

## Designing Adaptive Cards and Templates

A great resource is the adaptive card designer which can be found [here](https://adaptivecards.io/designer/). This helps to prototype and adjust the various settings/styles and options for adaptive cards before creating the template code for them. The [schema explorer](https://adaptivecards.io/explorer/) and [samples](https://adaptivecards.io/samples/) pages are also excellent resources to help with designing new adaptive card templates.

### Reducing drop-down options when too many are returned

To address the need to reduce the number of items returned and rendered in a drop down can be addressed by creating an additional adaptive card template in the flow that uses an `Input.Text` field type and allows the user to search on a keyword. Based on this input text field, you can add functionality to the bot to handle these search terms sent into the messaging extension `MessagingExtensionQuery`. In this way you can pre-filter and only provide relevant options for the user to choose between.
![searchcard](./assets/searchcard.png)
