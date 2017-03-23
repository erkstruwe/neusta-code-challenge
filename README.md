# neusta-code-challenge

## Changelog
### v0.1.1 (after review)
* "Parsing should not be implemented in entity (src/classes/Person.js) -> SoC"
  * Regarding the virtual setter `csvPersonString`: Parsing is exactly what virtual setters in Mongoose are for ([http://mongoosejs.com/docs/guide.html#virtuals](http://mongoosejs.com/docs/guide.html#virtuals)).
  * Regarding the two static methods `parseCsvThroughStream` and `parseCsvLineArray`: Well, that's rather a matter of taste or the "flavor" of SoC one implements. Some prefer the service-oriented approach by implementing a `Parser` class to separate "parsing" from "the model". I usually choose to be closer to the MVC pattern by separating "things related to model A" from "things related to model B". This doesn't get quite clear in this project because there is only one model.
* "Content needed to understand tests should be inside the test class/module"
  * That's right. I moved the data from Person.data.js to Person.unit.spec.js.
* "Test does not cover all cases, e. g. empty title attribute if no title is given"
  * In the internal data model, an empty title is indeed stored as null/undefined. However, the forOutput method already took care of returning the format specified in the challenge's rules (Person.unit.spec.js:124). I also added this check to the end to end tests.
* "Unnecessary test cases, e. g. data import has 33 data sets"
  * This test checks if the original test file is imported without errors. The file has 33 data sets. I think it is perfectly fine and also necessary to check if all persons are imported.
* "YAGNI principle is not applied"
  * So true.
  * Dropped many challenge-related inline comments
  * Dropped virtual getter for full name
  * Dropped `DELETE /api/person/`
  * Dropped `GET /api/person/`
  * Dropped `GET /api/person/:ldap`
  * Dropped test data generator at `GET /api/room/testData`
  * Dropped vertical scaling support
  * Dropped batched saving to database
* "Why is there a test file (`data/persons.csv`) and an original test file (`data/personsOriginal.csv`)?"
  * The former includes some more difficult names to parse. The latter is the file supplied in the challenge's rules.
* "Why is there an `api/person/` endpoint?"
  * The challenge rules required an `api/import` endpoint. That is a poor choice for a REST API because the endpoint's name does not contain information about *which resource should be imported* (in this case it's `person`). In addition, when the application grows, there might very well be other kinds of imports which would then provoke name conflicts. To resolve this issue and to stay compliant with the challenge's rules, I implemented a 307 redirect from `POST api/import` to `POST api/person`.
* "There are SQLite packages for Node.js"
  * Of course there are. However, since SQLite lacks many useful features and is not really needed to satisfy the challenge's rules, I decided to keep the "database" in memory.

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
</dl>

## Performance
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
| controllers |       100.0 % |
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
