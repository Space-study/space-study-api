import _ from 'lodash';
import type { ObjectLiteral } from 'typeorm';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import type { AbstractEntity } from './common/base/base.entity';
import type { AbstractDto } from './common/dtos/abstract.dto';
import type { KeyOfType } from './common/types/types';

declare global {
  export type Uuid = string & { _uuidBrand: undefined };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-redundant-type-constituents
  export type Todo = any & { _todoBrand: undefined };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Array<T> {
    toDtos<Dto extends AbstractDto>(this: T[], options?: unknown): Dto[];
  }
}

declare module 'typeorm' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface SelectQueryBuilder<Entity> {
    searchByString(
      q: string,
      columnNames: string[],
      options?: {
        formStart: boolean;
      },
    ): this;

    leftJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    leftJoin<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    innerJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    innerJoin<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;
  }
}

export function registerArrayExtensions(): void {
  Array.prototype.toDtos = function <
    Entity extends AbstractEntity<Dto>,
    Dto extends AbstractDto,
  >(options?: unknown): Dto[] {
    return _.compact(
      _.map<Entity, Dto>(this as Entity[], (item) =>
        item.toDto(options as never),
      ),
    );
  };

  SelectQueryBuilder.prototype.searchByString = function (
    q,
    columnNames,
    options,
  ) {
    if (!q) {
      return this;
    }

    this.andWhere(
      new Brackets((qb) => {
        for (const item of columnNames) {
          qb.orWhere(`${item} ILIKE :q`);
        }
      }),
    );

    if (options?.formStart) {
      this.setParameter('q', `${q}%`);
    } else {
      this.setParameter('q', `%${q}%`);
    }

    return this;
  };
}
