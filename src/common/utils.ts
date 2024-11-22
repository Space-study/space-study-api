/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import bcrypt from 'bcrypt';
import { getMetadataArgsStorage } from 'typeorm';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(
  password: string | undefined,
  hash: string | undefined | null,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

export function getVariableName<TResult>(
  getVar: () => TResult,
): string | undefined {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replaceAll(/(\r\n|\n|\r|\s)/gm, ''),
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }

  const fullMemberName = m[1]!;

  const memberParts = fullMemberName.split('.');

  return memberParts.at(-1);
}

export function reorderColumns(entity: Function, columnsToMove: string[]) {
  const metadata = getMetadataArgsStorage();

  if (!metadata || !metadata.columns) {
    throw new Error('Unable to access TypeORM metadata storage.');
  }

  const columns = metadata.columns.filter((col) => col.target === entity);

  if (!columns.length) {
    throw new Error(`No columns found for entity: ${entity.name}`);
  }

  const reorderedColumns = [
    ...columns.filter((col) => !columnsToMove.includes(col.propertyName)),
    ...columns.filter((col) => columnsToMove.includes(col.propertyName)),
  ];

  const filteredColumns = metadata.columns.filter(
    (col) => col.target !== entity,
  );
  const newColumns = [...filteredColumns, ...reorderedColumns];

  Object.assign(metadata, { columns: newColumns });
}
