/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import * as ACData from "adaptivecards-templating"

/**
 * Combine the data and the template to produce a new Adaptive Card
 *
 * @param data DialogPayload JSON
 * @param cardTemplate Adaptive card template
 * @returns Populated adaptive card object
 */
export function process(data: any, cardTemplate: any): any {
	// Utilize native Adaptive Card templating to exapnd the template
	const template = new ACData.Template(cardTemplate)
	return template.expand({
		$root: data,
	})
}
