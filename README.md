# neusta-code-challenge

## Installation
Prerequisites
* node ^6.10.0
* npm ^3.10.10
```
npm install
```

## Usage
```
npm start
```
The server will be available at [http://localhost:3000/](http://localhost:3000/).

## Design decisions
<dl>
    <dt>Node.js</dt>
    <dd>The task is I/O-heavy. Node.js is built for that. Splitting a task into subtasks and running them in parallel is a breeze.</dd>
    <dt>Express</dt>
    <dd>Very little code necessary to get a secure high-performance REST API going.</dd>
    <dt>Node.js' stream API</dt>
    <dd>
        While looking unfamiliar to developers not used to node development, it has huge advantages compared to other approaches:
        <ul>
            <li>super fast, parallel computing</li>
            <li>
                shared back-pressure
                <ul>
                    <li>data is processed as fast as the slowest consumer in pipeline of streams</li>
                    <li>e. g. during a file upload, incoming HTTP data is throttled if inserting into database is slow to prevent buffers and memory size from growing</li>
                    <li>after having been processed, chunks of data do not stay in memory</li>
                </ul>
            </li>
            <li>e. g. for HTTP requests, data processing is started as soon as the first chunks of data arrive at the server (while the rest of the request is still being received)</li>
            <li>with its very low memory usage, it can handle input files of any size, even if they exceed the system's memory</li>
    </dd>
    <dt>Data model</dt>
    <dd>
        <ul>
            <li>
                Instead of a database, a local variable is used in order to comply with the challenge's rules. This should not be done in production and renders some of the stream API's advantages useless (like e. g. unlimited file size or streaming from and to the database).
            </li>
            <li>
                The internal data model is based on the `Person` class only. There is nothing like a `Room` class, since rooms do not have any attributes yet.
            </li>
            <li>
                To keep a consistent naming scheme, some things have been renamed (redirects are in place where applicable).
                <ul>
                    <li>POST http://localhost:3000/api/import is also availbale at POST http://localhost:3000/api/person</li>
                    <li>`people` are called `person` or `persons` respectively throughout the application</li>
                    <li>a person's attributes are converted from space-separated to camelCase internally to stay consistent with JavaScript conventions and best practices</li>
                </ul>
            </li>
        </ul>
    </dd>
</dl>

## Extras
### Test data generator
Get test data of arbitrary size at [http://localhost:3000/api/room/testData](http://localhost:3000/api/room/testData). It returns data for 10,000 rooms. With the `maxPersonsPerRoom` parameter, you can control the files size. The default is `1000`.

A value of `100` results in a file with ~900,000 persons and ~10 MB size.

A value of `1000` results in a file with ~9,000,000 persons and ~100 MB size.

A value of `10000` results in a file with ~90,000,000 persons and ~1 GB size.

And so on...

Use this for testing the API's performance.

This application is able to parse and save ~64,000 persons per second over HTTP on a standard office notebook.

## Project structure
TODO
<dl>
    <dt>coverage</dt>
    <dd>Coverage reports for unit and end to end as well as the combined result in JSON and HTML</dd>
    <dt>data</dt>
    <dd>CSV files used for testing</dd>
</dl>

## Static code analysis
```
npm run lint
```

## Testing
### Coverage
TODO

### Unit
```
npm run test:unit
```

### End to end
Start server on terminal 1:
```
npm run test:e2e:istanbul
```
Start tests on terminal 2:
```
npm run test:e2e:jasmine
```
Stop server with <kbd>Ctrl</kbd> + <kbd>C</kbd> on terminal 1 after tests have finished.

### Coverage reports
Located in the `coverage` subfolder. Separated in `unit`, `e2e`, and `combined`. To update combined, run
```
npm run test:combine
```
