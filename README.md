# TypeORM transactional tests

[![Travis](https://img.shields.io/travis/alexjoverm/typescript-library-starter.svg)](https://travis-ci.org/alexjoverm/typescript-library-starter)
[![Coveralls](https://img.shields.io/coveralls/alexjoverm/typescript-library-starter.svg)](https://coveralls.io/github/alexjoverm/typescript-library-starter)

TypeORM does not provide builtin transactional tests. If your tests write to a non in-memory database, probably you have to truncate 
or erase all your tables for every test case.

This package allows the creation of transactional contexts during the test, starting a transaction in the begining of the test 
and rolling back at the end. This is a faster solution than truncate/delete, once nothing is really written to disk.   

### Install
```bash
npm install --save-dev typeorm-transactional-tests
```

### Usage

####Jest
To apply the transactional context with Jest, just start the context in an `beforeEach` block and finish it in an `afterEach`:
```typescript
import TransactionalTestContext from 'typeorm-transactional-tests'

const connection = getConnection();
const transactionalContext = new TransactionalTestContext(connection);

describe('some repository test', () => {
  beforeEach(async () => await transactionalContext.start())
  afterEach(async () => await transactionalContext.finish())
})
```
Also, it is possible to apply the context to all your tests using a global Jest setup file. Add a new file on your test folder:

```typescript 
import TransactionalTestContext from 'typeorm-transactional-tests'

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
