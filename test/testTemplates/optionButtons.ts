export const apiPayload = {
	cardTemplateType: "optionButtons",
	text: "Great! Please choose your doctor.",
	choices: [
		{
			title: "Frankenstein",
			value: 0,
		},
		{
			title: "Strange",
			value: 1,
		},
		{
			title: "Strangelove",
			value: 2,
		},
	],
}

export const template = {
	$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
	version: "1.3",
	type: "AdaptiveCard",
	body: [
		{
			type: "TextBlock",
			size: "Medium",
			text: "${text}",
			wrap: true,
		},
	],
	actions: [
		{
			$data: "${choices}",
			type: "Action.Submit",
			title: "${title}",
			data: {
				response: "${value}",
			},
		},
	],
}

export const expectedResponse = {
	$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
	version: "1.3",
	type: "AdaptiveCard",
	body: [
		{
			type: "TextBlock",
			size: "Medium",
			text: "Great! Please choose your doctor.",
			wrap: true,
		},
	],
	actions: [
		{ type: "Action.Submit", title: "Frankenstein", data: { response: 0 } },
		{ type: "Action.Submit", title: "Strange", data: { response: 1 } },
		{ type: "Action.Submit", title: "Strangelove", data: { response: 2 } },
	],
}

export const expectedResponseAltered = {
	$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
	version: "1.3",
	type: "AdaptiveCard",
	body: [
		{
			type: "TextBlock",
			size: "Large",
			text: "Great! Please choose your doctor.",
			wrap: true,
		},
	],
	actions: [
		{ type: "Action.Submit", title: "Frankenstein", data: { response: 0 } },
		{ type: "Action.Submit", title: "Strange", data: { response: 1 } },
		{ type: "Action.Submit", title: "Strangelove", data: { response: 2 } },
	],
}
