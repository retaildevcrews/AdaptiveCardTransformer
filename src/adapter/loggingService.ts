import * as winston from "winston"

// Define log levels for your logger
const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
}

// This method sets the current severity based on the current NODE_ENV.
// If the server was run in development mode, show all the log levels.
// If it was run in production, show only warn and error messages.
const level = () => {
	const env = process.env.NODE_ENV || "development"
	const isDevelopment = env === "development"
	return isDevelopment ? "debug" : "warn"
}

// Define different colors for each level.
// Colors make the log message more visible.
const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "white",
}

// Tell winston that you want to link the colors defined above to the severity levels.
winston.addColors(colors)

// Customize your logs via the log format.
const format = winston.format.combine(
	// Add the message timestamp with the preferred format
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
	// Tell Winston that the logs must be colored
	winston.format.colorize({ all: true }),
	// Tell Winston what you want to include in metadata
	winston.format.metadata({
		fillExcept: ["message", "level", "timestamp", "label"],
	}),
	// Define the format of the log message. Here we show the service name, timestamp, the level and the message
	winston.format.printf((info) => {
		let out = `[${info.metadata.service}] ${info.timestamp} ${info.level}: ${info.message}`
		if (info.metadata.error) {
			out = out + " " + info.metadata.error
			if (info.metadata.error.stack) {
				out = out + " " + info.metadata.error.stack
			}
		}
		return out
	}),
)

// Define which transports the logger must use. In this example, we are logging to the Console.
// You can add additional transports here. For example, logging to a file or use other winston transport methods.
const transports = [
	// Allow the use the console to print the messages
	new winston.transports.Console(),

	// Allow to print all the logs to a combined file
	// new winston.transports.File({ filename: "combined.log" }),
]

/**
 * Create a Logger instance for each module with configuration defined above.
 * The moduleName will override meta data on each logger so we can better trace logging flow between system components.
 *
 * @param moduleName Name of the module you are creating the logger for
 * @returns winston.Logger
 */

function createLogger(moduleName: string): winston.Logger {
	const Logger = winston.createLogger({
		level: level(),
		levels,
		defaultMeta: { service: moduleName },
		format,
		transports,
	})
	return Logger
}

export default createLogger
