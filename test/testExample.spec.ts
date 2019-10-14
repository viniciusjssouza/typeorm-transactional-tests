import { Connection, createConnection, getConnection, Repository } from 'typeorm'
import TransactionalTestContext from '../src/transactionalTestContext'
import Person from './entities/person.entity'

describe('transactional test example', () => {
  let connection: Connection
  let repository: Repository<Person>
  let transactionalContext: TransactionalTestContext

  beforeEach(async () => {
    await createConnection({
      type: 'sqlite',
      name: 'default',
      synchronize: true,
      dropSchema: true,
      entities: [Person],
      database: ':memory:'
    })
  })

  beforeEach(async () => {
    connection = getConnection()
    repository = connection.getRepository(Person)
    transactionalContext = new TransactionalTestContext(connection)
    await transactionalContext.start()
    await repository.save(new Person({ name: 'Vinicius Souza' }))
  })

  describe('rollback transaction', () => {
    it('the database should be empty', async () => {
      expect(await repository.count()).toEqual(1)
      await transactionalContext.finish()
      expect(await repository.count()).toEqual(0)
    })
  })
})
