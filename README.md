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
    <dd>The task is I/O-heavy. Node.js is built for that. Splitting a task into subtasks and running them <b>in parallel</b> is a breeze.</dd>
    <dt>Express</dt>
    <dd>Very little code necessary to get a <b>secure high-performance</b> REST API going.</dd>
    <dt>Node.js' stream API</dt>
    <dd>
        While looking unfamiliar to developers not used to node development, it has huge advantages compared to other approaches:
        <ul>
            <li>Super fast, parallel computing</li>
            <li>
                Shared back-pressure
                <ul>
                    <li>Data is processed as fast as the slowest consumer in the stream's pipeline.</li>
                    <li>During a file upload, incoming HTTP data is throttled if a downstream task (e. g. inserting into database) is slow to prevent buffers and memory size from growing.</li>
                </ul>
            </li>
            <li>As an example, data processing of HTTP requests is started <b>as soon as the first chunks of data arrive at the server</b> (while the rest of the request is still being received).</li>
            <li>The same applies for error handling. If there is a duplicate room <b>on the first two lines of a 10 GB file</b>, the server responds with an error message immediately, not only after several minutes of uploading and analyzing the file.</li>
            <li>After having been processed, chunks of data do not stay in memory. At no time is a large request body fully held in memory.</li>
            <li>With its very low memory usage, it can handle <b>input files of any size</b>, even if they exceed the system's memory.</li>
    </dd>
    <dt>Data model</dt>
    <dd>
        <ul>
            <li>
                Instead of a database, a local variable is used as storage in order to comply with the challenge's rules. This should not be done in production and renders some of the stream API's advantages useless (like e. g. unlimited file size or streaming from and to the database).
            </li>
            <li>
                The data-modelling library Mongoose is used to define the Person schema. Thus, the appllication takes advantage of its structured way of definig a schema, built-in validation support, good testability, and the possibility to <b>switch to a Mongo DB as the persistance layer with just a few lines</b>.
            </li>
            <li>
                The internal data model is based on the `Person` schema only. There is nothing like a `Room` schema, since rooms do not have any attributes yet.
            </li>
            <li>
                To keep a consistent naming scheme, some things have been renamed (redirects are in place where applicable):
                <ul>
                    <li>POST /api/import is also availbale at POST /api/person</li>
                    <li>`people` are called `person` or `persons` respectively throughout the application.</li>
                    <li>A person's attributes are converted from space-separated to camelCase internally to stay consistent with JavaScript conventions and best practices.</li>
                </ul>
            </li>
        </ul>
    </dd>
    <dt>Scalability</dt>
    <dd>Vertical scalability is done by starting several web workers per machine, e. g. one per CPU core. See `src/config.js` for details. Horizontal scalability is simply done by running an arbitrary number of machines behind a load balancer. Both options are currently disabled because no real database may be used in the challenge.</dd>
</dl>

## Extras
### Person endpoints
Endpoints for persons have been added to make the REST API "more complete".

Use GET [http://localhost:3000/api/person](http://localhost:3000/api/person) to get a list of all persons.

Use GET http://localhost:3000/api/person/:ldap (e. g. GET [http://localhost:3000/api/person/bwayne](http://localhost:3000/api/bwayne)) to find a person by his or her ldap name.

### Test data generator
Get test data of arbitrary size at [http://localhost:3000/api/room/testData](http://localhost:3000/api/room/testData). The endpoint returns data for 10,000 rooms. With the `maxPersonsPerRoom` parameter, you can control the file's size. The default is `1000`.

A value of `100` results in a file with ~900,000 persons and ~10 MB size.

A value of `1000` results in a file with ~9,000,000 persons and ~100 MB size.

A value of `10000` results in a file with ~90,000,000 persons and ~1 GB size.

And so on...

**Use these to test the API's performance.**

This application is able to parse and save <b>~64,000 persons per second</b> over HTTP on a standard office notebook.

## Project structure
The project structure is heavily inspired by popular REST/MVC frameworks like Sails.js.

<dl>
    <dt>coverage</dt>
    <dd>Coverage reports for unit and end to end as well as the combined result in JSON and HTML</dd>
    <dt>data</dt>
    <dd>CSV files used for testing</dd>
    <dt>src</dt>
    <dd>
        <dl>
            <dt>classes</dt>
            <dd>The Person schema and model (Mongoose)</dd>
            <dt>controllers</dt>
            <dd>REST API controller functions (the ones that actually respond to the request). <b>These <em>are</em> the functions you're looking for...</b></dd>
            <dt>middlewares</dt>
            <dd>Functions altering the request or response object before routing takes place</dd>
            <dt>responses</dt>
            <dd>Response helper functions (e. g. static error messages)</dd>
            <dt>routers</dt>
            <dd>Hierarchical routing tree representing the URL paths</dd>
            <dt>config.js</dt>
            <dd>Global configuration file</dd>
            <dt>index.js</dt>
            <dd>Main server entry point used by `npm start`. Spawns 1 web worker in this version. Will spawn 1 web worker per CPU core as soon as a real database may be used.</dd>
            <dt>server.js</dt>
            <dd>The web worker as an Express application.</dd>
        </dl>
    </dd>
</dl>

## Static code analysis
```
npm run lint
```

## Testing
### Coverage
`classes` and `responses` are covered by unit tests in `*.unit.spec.js` files. `controllers` are covered by end to end tests in `*.e2e.spec.js` files.

Currently, the line coverage status is as follows:

|    Folder   | Line coverage |
|:-----------:|:-------------:|
| classes     |       100.0 % |
| controllers |        95.7 % |
| responses   |       100.0 % |

### Unit
```
npm run test:unit
```

### End to end
During end to end testing, real HTTP requests are fired against the real REST API server.

Start server on terminal 1:
```
npm run test:e2e:istanbul
```
Start tests on terminal 2:
```
npm run test:e2e:jasmine
```
Stop server with <kbd>Ctrl</kbd> + <kbd>C</kbd> on terminal 1 after tests have finished to have the coverage report written.

### Coverage reports
Located in the `coverage` folder. Separated into `unit`, `e2e`, and `combined` subfolders. To update `combined`, run
```
npm run test:combine
```

##### Thanks for trying!
