"use strict";

// Modules of nodejs
const path                              = require('path');
const fsExtra                           = require('fs-extra');
const fs                                = require('fs');
const winston                           = require('winston');


// Export of functions
module.exports = {
	create,
	get,
}

const loggers = {};

/**
 * Function for create logger.
 * @param {Object} options - Options
 * @param {String} options.name - Name of logger.
 * @param {Array} [options.levels] - Array of log levels.
 * @param {String} [options.level] - Current log level.
 * @param {String} [options.path] - Path of logs.
 * @param {Number} [options.maxSize=10*1024*1024] - Max size of one log file.
 * @param {Number} [options.maxFiles=30] - Max number of log files.
 * @param {Boolean} [options.isUtcTime] - If true time will be displayed in UTC format.
 * @returns {winston.Logger} Returns instance of winston.Logger.
 */
function create(options) {
	if (loggers[options.name] != undefined) {
		throw new Error(`Logger "${options.name}" already exists`);
		return;
	}

	const _createTimestamp = options.isUtcTime ? createTimestampUTC : createTimestamp;

	const logger = loggers[options.name] = winston.createLogger({
		levels: options.levels || { fatal: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5, },
		transports: [
			new winston.transports.Console({
				level: options.level,
			}),
			new winston.transports.File({
				level: options.level,
				filename: path.normalize(options.path),
				maxsize: options.maxSize || 10*1024*1024,
				maxFiles: options.maxFiles || 100,
				json: false,
			}),
		],
		format: winston.format.printf(
			/**
			 * Function of format of log.
			 * @param {Object} params - Parameters.
			 * @param {String} [params.message] - Message of log.
			 * @param {String} [params.className] - Class name which make log record.
			 * @param {String} [params.instanceName] - Instance name which make log record.
			 * @param {String} [params.funcName] - Function name which make log record.
			 * @param {Object} [params.data] - Any data for information.
			 * @param {Boolean} [params.isOnlyMessage] - If true show in log string only message, with out other parameters.
			 * @returns {String} Returns string.
			 */
			(params) => {
				if (params.isOnlyMessage == true) {
					return params.message;
				}
			
				let millisec = String(new Date().getUTCMilliseconds());
			
				if (millisec.length == 3) {}
				else if (millisec.length == 2) millisec = "0" + millisec;
				else if (millisec.length == 1) millisec = "00" + millisec;
				
				let classInstanceName = " ";
				if (params.className && params.instanceName) {
					classInstanceName += "["+ params.className +"::"+ params.instanceName +"]";
				} else if (params.className) {
					classInstanceName += "["+ params.className +"]";
				} else if (params.instanceName) {
					classInstanceName += "["+ params.instanceName +"]";
				}
			
				let funcName = "";
				if (params.funcName) {
					funcName = " "+ params.funcName;
				}
				
				let message = "";
				if (params.message.length > 0) {
					message = " : "+ params.message;
				}
				
				let data = "";
				if (params.data) {
					data = " : "+ JSON.stringify(params.data);
				}
			
				let level = params.level;
				if (level.length < 5) {
					while (level.length < 5) level += " ";
				} else if (level.length > 5) {
					level = level.substr(0, 5);
				}
			
				let logtext = `[${_createTimestamp()}] [${level}]${classInstanceName}${funcName}${message}${data}`;
			
				return logtext;
			}
		),
	});
	
	logger.on('error', (err) => console.log(`[${_createTimestamp()}] [sys  ] [log-manager] logger.on error : ${err.toString()}`));
	
	const dir = path.dirname(options.path);
	
	try {
		let stats = fs.statSync(dir);
		if (stats.isDirectory() != true) throw new Error(`Path "${dir}" exists, but is not directory`);
	}
	catch(err) {
		if (err.code === "ENOENT") {
			fsExtra.ensureDirSync(dir);
		} else {
			throw err;
		}
	}

	return logger;
}

/**
 * Function for get logger.
 * @param {string} name - Name of logger.
 * @returns {winston.Logger} Returns instance of winston.Logger.
 */
function get(name) {
	return loggers[name];
}

/**
 * Create timestamp.
 * @returns {String} Returns timestamp.
 */
function createTimestamp() {
	const date = new Date();
	const day = String(date.getDate());
	const month = String(date.getMonth() + 1);
	const year = date.getFullYear();
	const hours = String(date.getHours());
	const minutes = String(date.getMinutes());
	const seconds = String(date.getSeconds());
	let millisec = String(date.getUTCMilliseconds());
	
	if (millisec.length == 2) millisec = "0" + millisec;
	else if (millisec.length == 1) millisec = "00" + millisec;

	return (
		((day.length < 2) ? ("0"+day) : (day)) +
		"-" +
		((month.length < 2) ? ("0"+month) : (month)) +
		"-" +
		year +
		" " +
		((hours.length < 2) ? ("0"+hours) : (hours)) +
		":" +
		((minutes.length < 2) ? ("0"+minutes) : (minutes)) +
		":" +
		((seconds.length < 2) ? ("0"+seconds) : (seconds)) +
		"." +
		millisec
	)
}

/**
 * Create UTC timestamp.
 * @returns {String} Returns timestamp.
 */
function createTimestampUTC() {
	const date = new Date();

	const day = String(date.getUTCDate());
	const month = String(date.getUTCMonth() + 1);
	const year = date.getUTCFullYear();
	const hours = String(date.getUTCHours());
	const minutes = String(date.getUTCMinutes());
	const seconds = String(date.getUTCSeconds());
	let millisec = String(date.getUTCMilliseconds());
	
	if (millisec.length == 2) millisec = "0" + millisec;
	else if (millisec.length == 1) millisec = "00" + millisec;

	return (
		((day.length < 2) ? ("0"+day) : (day)) +
		"-" +
		((month.length < 2) ? ("0"+month) : (month)) +
		"-" +
		year +
		" " +
		((hours.length < 2) ? ("0"+hours) : (hours)) +
		":" +
		((minutes.length < 2) ? ("0"+minutes) : (minutes)) +
		":" +
		((seconds.length < 2) ? ("0"+seconds) : (seconds)) +
		"." +
		millisec
	)
}