/**
 * Wraps the original TypeORM query runner to intercept some calls
 * and manipulate the transactional context.
 */
import { QueryRunner } from 'typeorm';

interface QueryRunnerWrapper extends QueryRunner {
  releaseQueryRunner(): Promise<void>;
}

let release: () => Promise<void>;

const wrap = (originalQueryRunner: QueryRunner): QueryRunnerWrapper => {
  release = originalQueryRunner.release;
  originalQueryRunner.release = () => {
    return Promise.resolve();
  };

  (originalQueryRunner as QueryRunnerWrapper).releaseQueryRunner = () => {
    originalQueryRunner.release = release;
    return originalQueryRunner.release();
  };

  return originalQueryRunner as QueryRunnerWrapper;
};

export { QueryRunnerWrapper, wrap };
