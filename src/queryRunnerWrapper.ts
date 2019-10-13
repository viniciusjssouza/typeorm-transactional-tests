/**
 * Wraps the original TypeORM query runner to apply the transactional context
 * during tests.
 */
import { QueryRunner } from 'typeorm'

interface QueryRunnerWrapper extends QueryRunner {
  releaseQueryRunner(): Promise<void>;
}

const wrap = (originalQueryRunner: QueryRunner): QueryRunnerWrapper => {
  const wrapper = {} as QueryRunnerWrapper;
  Object.setPrototypeOf(wrapper, Object.getPrototypeOf(originalQueryRunner));

  wrapper.release = () => {
    return Promise.resolve();
  }

  wrapper.releaseQueryRunner = () => {
    return originalQueryRunner.release();
  }

  return wrapper;
}

export { QueryRunnerWrapper, wrap }
