
const path = require("path");
const logManager = require("./index.js");

const testLogger = logManager.create({
	name: "test-logger",
	levels: { fatal: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5, },
	level: "trace",
	path: path.normalize(`${__dirname}/test-logs.log`),
	maxSize: 10*1024*1024, // 10Mb
	maxFiles: 1,
	isUtcTime: false,
});

setInterval(() => {
	const data = { key1: "value1", key2: ["val0", "val1",], };
	testLogger.trace("", { className: "MyClass", instanceName: "myInstance", funcName: 'myFunction', data: data, });
}, 500);