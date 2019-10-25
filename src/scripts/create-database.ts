import Knex, { CreateTableBuilder, TableBuilder } from 'knex';
import { DatabaseSingleton } from './../database';

async function main() {
  const knex = DatabaseSingleton.connection;

  await createUsersTable(knex);
  await createDrinksTable(knex);
  await createIngredientsTable(knex);
  await createDrinkIngredientsTable(knex);
  await createGroupTable(knex);
  await createGroupUsersTable(knex);
  await createRoundTable(knex);
  await createRoundDrinksTable(knex);
  await createRelationships(knex);

  process.exit(0);
};


async function createUsersTable(database: Knex) {
  const tableName = 'users';
  const hasTable = await database.schema.hasTable(tableName);

  if (hasTable) {
    console.debug(`${tableName} exists!`)
    return;
  }

  return database.schema.createTable(tableName, (tableBuilder: CreateTableBuilder) => {
    tableBuilder.increments('id').primary();
    tableBuilder.string('username').unique();
    tableBuilder.string('password');
    tableBuilder.string('email').unique();
  });
}

async function createDrinksTable(database: Knex) {
  const tableName = 'drinks';
  const hasTable = await database.schema.hasTable(tableName);

  if (hasTable) {
    console.debug(`${tableName} exists!`)
    return;
  }

  return database.schema.createTable(tableName, (tableBuilder: CreateTableBuilder) => {
    tableBuilder.increments('id').primary();
    tableBuilder.string('name');
    tableBuilder.integer('owner');
  });
}

async function createIngredientsTable(database: Knex) {
  const tableName = 'ingredients';
  const hasTable = await database.schema.hasTable(tableName);

  if (hasTable) {
    console.debug(`${tableName} exists!`)
    return;
  }

  return database.schema.createTable(tableName, (tableBuilder: CreateTableBuilder) => {
    tableBuilder.increments('id').primary();
    tableBuilder.string('name').unique();
    tableBuilder.integer('owner');
  });
}


async function createDrinkIngredientsTable(database: Knex) {
  const tableName = 'drink_ingredients';
  const hasTable = await database.schema.hasTable(tableName);

  if (hasTable) {
    console.debug(`${tableName} exists!`)
    return;
  }

  return database.schema.createTable(tableName, (tableBuilder: CreateTableBuilder) => {
    tableBuilder.integer('drink_id');
    tableBuilder.integer('ingredient_id');
  });
}

async function createGroupTable(database: Knex) {
  if (await database.schema.hasTable('groups')) return;

  return database.schema.createTable('groups', (tableBuilder: TableBuilder) => {
    tableBuilder.increments('id').primary();
    tableBuilder.string('name');
    tableBuilder.integer('owner');
  });
}

async function createGroupUsersTable(database: Knex) {
  if (await database.schema.hasTable('group_users')) return;

  return database.schema.createTable('group_users', (tableBuilder: TableBuilder) => {
    tableBuilder.increments('id').primary();
    tableBuilder.integer('user');
    tableBuilder.integer('group');
  });
} 

async function createRoundTable(database: Knex) {
  if (await database.schema.hasTable('rounds')) return;

  return database.schema.createTable('rounds', (tableBuilder: TableBuilder) => {
    tableBuilder.increments('id').primary();
    tableBuilder.integer('creator');
    tableBuilder.integer('group');
    tableBuilder.integer('status');
  });
}

async function createRoundDrinksTable(database: Knex) {
  if (await database.schema.hasTable('round_drinks')) return;

  return database.schema.createTable('round_drinks', (tableBuilder: TableBuilder) => {
    tableBuilder.increments('id').primary();
    tableBuilder.integer('round');
    tableBuilder.integer('drink');
    tableBuilder.integer('status');
  });
}

async function createRelationships(database: Knex) {
  // Create drink_ingredients.drink_id -> drinks.id
  // Create drink_ingredients.ingredients_id -> ingredients.id
  await database.schema.alterTable('drink_ingredients', (tableBuilder: TableBuilder) => {
    tableBuilder.foreign('drink_id').references('drinks.id');
    tableBuilder.foreign('ingredient_id').references('ingredients.id');
  });

  await database.schema.alterTable('rounds', (tableBuilder: TableBuilder) => {
    tableBuilder.foreign('creator').references('users.id');
    tableBuilder.foreign('group').references('groups.id');
  });

  await database.schema.alterTable('round_drinks', (tableBuilder: TableBuilder) => {
    tableBuilder.foreign('round').references('rounds.id');
    tableBuilder.foreign('drink').references('drinks.id');
  });

  await database.schema.alterTable('groups', (tableBuilder: TableBuilder) => {
    tableBuilder.foreign('owner').references('users.id');
  });

  return database.schema.alterTable('group_users', (tableBuilder: TableBuilder) => {
    tableBuilder.foreign('user').references('users.id');
    tableBuilder.foreign('group').references('groups.id');
  });
}


main();
