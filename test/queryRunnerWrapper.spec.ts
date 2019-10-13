import { QueryRunnerWrapper, wrap } from '../src/queryRunnerWrapper'
import { QueryRunner } from 'typeorm'

describe("QueryRunner wrap", () => {
  let mockedQueryRunner: QueryRunner;
  let wrapper: QueryRunnerWrapper;

  beforeEach(() => {
    mockedQueryRunner = Object.create({
      connect: jest.fn(),
      release: jest.fn(),
    }) as QueryRunner;

    wrapper = wrap(mockedQueryRunner);
  });

  describe('releaseQueryRunner', () => {
    beforeEach(() => wrapper.releaseQueryRunner());

    it ('should delegate the call to the provided runner', () => {
      expect(mockedQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('wrap release', () => {
    beforeEach(() => wrapper.release());

    it ('should NOT delegate the call to the provided runner', () => {
      expect(mockedQueryRunner.release).not.toHaveBeenCalled();
    });
  });

  describe('wrap connect', () => {
    beforeEach(() => wrapper.connect());

    it ('should delegate the call to the provided runner', () => {
      expect(mockedQueryRunner.connect).toHaveBeenCalled();
    });
  });
})
