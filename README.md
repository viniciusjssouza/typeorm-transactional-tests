# TypeORM transactional tests

[![Travis](https://app.travis-ci.com/viniciusjssouza/typeorm-transactional-tests.svg?branch=master&status=passed)](https://app.travis-ci.com/github/viniciusjssouza/typeorm-transactional-tests)
[![Coverage Status](https://coveralls.io/repos/github/viniciusjssouza/typeorm-transactional-tests/badge.svg?branch=master)](https://coveralls.io/github/viniciusjssouza/typeorm-transactional-tests?branch=master)

TypeORM does not provide built-in transactional tests. If your tests are written to a non-in-memory database, probably you have to truncate 
or erase all your tables for every test case.

This package allows the creation of transactional contexts during the test, starting a transaction at the beginning of the test 
and rolling back at the end. This is a faster solution than truncate/delete, once nothing is really written to disk.   

### Install
```shell
npm install --save-dev typeorm-transactional-tests
```

Or with yarn:
```shell
yarn add --dev typeorm-transactional-tests
```


### Typeorm compatibility 
Versions **1.x.x** of this library are compatible with typeorm **0.2.x**

Versions **2.x.x** of this library are compatible with typeorm **0.3.x**

### Usage

#### Jest

To apply the transactional context with Jest, just start the context in a `beforeEach` block and finish it in an `afterEach`:
```typescript
import {Connection, getConnection } from 'typeorm';
import { TransactionalTestContext } from 'typeorm-transactional-tests';

let connection: Connection;
let transactionalContext: TransactionalTestContext;

beforeEach(async () => {
    connection = getConnection();
    transactionalContext = new TransactionalTestContext(connection);
    await transactionalContext.start();    
});

afterEach(async () => {
    await transactionalContext.finish();
});
```

Also, it is possible to apply the context to all your tests using a global Jest setup file. Add a new file to your test folder:

```typescript 
import { TransactionalTestContext } from 'typeorm-transactional-tests'

// @ts-ignore
global.beforeEach(async () => await transactionalContext.start());

// @ts-ignore
global.afterEach(async () => await transactionalContext.finish());
```
And point the Jest configuration to it:
```json
 "setupFilesAfterEnv": [
   "<rootDir>/test/support/transactionalContext.ts"
  ]
```
