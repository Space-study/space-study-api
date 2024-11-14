import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { Property } from 'src/common/decorators/property.decorator';
import { PropertyType } from 'src/common/enums/property.enum';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  author: string;

  @Column(() => BaseEntity, { prefix: false })
  @Property(PropertyType.Order)
  baseEntity: BaseEntity;
}
