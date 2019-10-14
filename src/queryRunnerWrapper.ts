/**
 * Wraps the original TypeORM query runner to intercept some calls
 * and manipulate the transactional context.
 */
import { QueryRunner } from 'typeorm'

interface QueryRunnerWrapper extends QueryRunner {
  releaseQueryRunner(): Promise<void>
}

const wrap = (originalQueryRunner: QueryRunner): QueryRunnerWrapper => {
  const wrapper = {} as QueryRunnerWrapper
  Object.setPrototypeOf(wrapper, Object.getPrototypeOf(originalQueryRunner))
  Object.assign(wrapper, originalQueryRunner)
  wrapper.release = () => {
    return Promise.resolve()
  }

  wrapper.releaseQueryRunner = () => {
    return originalQueryRunner.release()
  }

  return wrapper
}

export { QueryRunnerWrapper, wrap }
