import { Column, CreatedAt, DataType, Model, PrimaryKey, Sequelize, Table } from 'sequelize-typescript';

@Table({
  tableName: 'domains',
  updatedAt: false,
  deletedAt: false
})
export class DomainModel extends Model {
  @PrimaryKey
  @Column({
    field: 'domain_id',
    type: DataType.CHAR(16),
    allowNull: false
  })
  domainId: string;

  @Column({
    field: 'domain_name',
    type: DataType.STRING(255),
    allowNull: false,
    defaultValue: ''
  })
  domainName: string;

  @Column({
    field: 'domain_description',
    type: DataType.TEXT,
    allowNull: false
  })
  domainDescription: string;

  @Column({
    field: 'domain_price',
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  domainPrice: number;

  @Column({
    field: 'broker',
    type: DataType.STRING(255),
    allowNull: false,
    defaultValue: ''
  })
  broker: string;

  @CreatedAt
  @Column({
    field: 'created',
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  })
  bookCreated: Date;
}
