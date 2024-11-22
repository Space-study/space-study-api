import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';
import { FindAllResponse } from '../types';

/**
 * Base repository interface that defines common database operations
 * @template T The entity type this repository manages
 */
export interface BaseInterfaceRepository<T> {
  /**
   * Creates a new entity instance
   * @param data The data to create the entity with
   * @returns A new entity instance
   */
  create(data: DeepPartial<T>): T;

  /**
   * Creates multiple new entity instances
   * @param data Array of data to create entities with
   * @returns Array of new entity instances
   */
  createMany(data: DeepPartial<T>[]): T[];

  /**
   * Saves an entity to the database
   * @param data The entity data to save
   * @returns Promise resolving to the saved entity
   */
  save(data: DeepPartial<T>): Promise<T>;

  /**
   * Saves multiple entities to the database
   * @param data Array of entity data to save
   * @returns Promise resolving to array of saved entities
   */
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;

  /**
   * Finds an entity by its UUID
   * @param uuid The UUID to search for
   * @returns Promise resolving to the found entity
   */
  findOneByUuid(uuid: Uuid): Promise<T>;

  /**
   * Finds an entity by custom conditions
   * @param filterCondition The conditions to filter by
   * @returns Promise resolving to the found entity
   */
  findByCondition(filterCondition: FindOneOptions<T>): Promise<T>;

  /**
   * Finds all entities matching optional conditions
   * @param filter Optional filter options
   * @param options Optional find options
   * @returns Promise resolving to array of found entities
   */
  findAll(filter?: object, options?: object): Promise<FindAllResponse<T>>;

  /**
   * Removes an entity from the database
   * @param uuid The UUID of the entity to remove
   * @returns Promise resolving to the removed entity
   */
  softDelete(uuid: Uuid): Promise<boolean>;

  /**
   * Permanently removes an entity from the database
   * @param uuid The UUID of the entity to remove
   * @returns Promise resolving to true if the entity was removed, false otherwise
   */
  permanentlyRemove(uuid: Uuid): Promise<boolean>;

  /**
   * Finds entities with their relations loaded
   * @param relations The relations to load
   * @returns Promise resolving to array of found entities with relations
   */
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;

  /**
   * Preloads relations on an entity
   * @param entityLike The entity-like object to preload relations for
   * @returns Promise resolving to entity with loaded relations
   */
  preload(entityLike: DeepPartial<T>): Promise<T>;
}
