import { Column, Entity, Generated, PrimaryColumn } from 'typeorm'

@Entity('person')
export default class Person {
  @PrimaryColumn('integer')
  @Generated()
  public id: number

  @Column()
  public name: string

  constructor(data?: Partial<Person>) {
    Object.assign(this, data)
  }
}
