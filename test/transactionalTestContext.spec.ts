import * as wrapper from '../src/queryRunnerWrapper'
import { Connection, QueryRunner } from 'typeorm'
import TransactionalTestContext from '../src/transactionalTestContext'

jest.mock('../src/queryRunnerWrapper');

describe('TransactionalTestContext', () => {
  let connection: Connection;
  let transactionalTestContext: TransactionalTestContext;
  let wrappedRunner: any;
  const queryRunner = {} as QueryRunner;
  // @ts-ignore wrapper here is a jest mock
  wrapper.wrap = jest.fn().mockImplementation(() => wrappedRunner);

  beforeEach(() => {
    connection = Object.create({
      createQueryRunner: jest.fn().mockImplementation(() => queryRunner),
    }) as Connection;
    wrappedRunner = {
      connect: jest.fn(),
      releaseQueryRunner: jest.fn(),
      startTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    };
    transactionalTestContext = new TransactionalTestContext(connection);
  });

  describe('start', () => {
    describe('when the context is started with success', () => {
      beforeEach(async () => {
        await transactionalTestContext.start();
      });

      it ('should create the wrapped query builder', () => {
        expect(wrapper.wrap).toHaveBeenCalledWith(queryRunner);
      });

      it ('should connect with the database', () => {
        expect(wrappedRunner.connect).toHaveBeenCalled();
      });

      it ('should start the transaction', () => {
        expect(wrappedRunner.startTransaction).toHaveBeenCalled();
      });
    });

    describe('when there is an error during the process', () => {
      beforeEach(async () => {
        wrappedRunner.startTransaction.mockImplementation(() => { throw new Error('boom!') } );
        await transactionalTestContext.start();
      });

      it ('should clean the resources', () => {
        expect(wrappedRunner.releaseQueryRunner).toHaveBeenCalled();
      });
    });

    describe('when creating the runner fails', () => {
      beforeEach(async () => {
        connection.createQueryRunner = jest.fn(() => { throw new Error('boom!') } );
        await transactionalTestContext.start();
      });

      it ('should clean the resources', () => {
        expect(wrappedRunner.releaseQueryRunner).not.toHaveBeenCalled();
      });
    });

    describe('when start is called twice', () => {
      beforeEach(async () => {
        await transactionalTestContext.start();
      });

      it ('should raise an error', () => {
        expect(transactionalTestContext.start()).rejects.toThrow('Context already started');
      });
    });
  });

  describe('finish', () => {
    describe('when the context is finished with success', () => {
      beforeEach(async () => {
        await transactionalTestContext.start();
        await transactionalTestContext.finish();
      });

      it ('should rollback the transaction', () => {
        expect(wrappedRunner.rollbackTransaction).toHaveBeenCalled();
      });

      it ('should clean the resources', () => {
        expect(wrappedRunner.releaseQueryRunner).toHaveBeenCalled();
      });
    });

    describe('when there is an error during the process', () => {
      beforeEach(async () => {
        await transactionalTestContext.start();
        await transactionalTestContext.finish();
      });

      beforeEach(() => {
        wrappedRunner.rollbackTransaction.mockImplementation(() => { throw new Error('boom!') } );
      });

      it ('should clean the resources', () => {
        expect(wrappedRunner.releaseQueryRunner).toHaveBeenCalled();
      });
    });

    describe('when the context has not been started yet', () => {
      it ('should raise an error', () => {
        expect(transactionalTestContext.finish()).rejects.toThrow(new RegExp('Context not started'));
      });
    });
  });

});
