# log-manager

**log-manager** is a module for simple create loggers by **winston**.

<br>

# Install

```
npm install omarty/log-manager --save
```

<br>

# Functions

<br>

## `create(options)`
Function for create logger.
* `options` \<Object\>
* * `name` \<String\> Name of logger.
* * `levels` \<Object\> Object with log levels. By default looks like `{ fatal: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5, }`.
* * `level` \<String\> Current log level.
* * `path` \<String\> Path for log files.
* * `maxSize` \<Number\> Max size of one log file. **Default**: 10485760 bytes (10Mb).
* * `maxFiles` \<Number\> Max number of log files. **Default**: 30.
* * `isUtcTime` \<Boolean\> If true time will be displayed in UTC format. **Default**: false.
* Returns: \<winston.Logger\> - Returns instance of winston.Logger.

<br>

## `get(name)`
Function for get logger.
* `name` \<String\> Name of logger.
* Returns: \<winston.Logger\> - Returns instance of winston.Logger.

<br>

# Example of use

```javascript
const path = require("path");
const logManager = require("@omarty/log-manager");

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

// [08-12-2020 03:11:39.632] [trace] [MyClass::myInstance] myFunction : {"key1":"value1","key2":["val0","val1"]}
// [08-12-2020 03:11:40.133] [trace] [MyClass::myInstance] myFunction : {"key1":"value1","key2":["val0","val1"]}
// [08-12-2020 03:11:40.633] [trace] [MyClass::myInstance] myFunction : {"key1":"value1","key2":["val0","val1"]}
// ...
```
