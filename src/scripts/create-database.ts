import Knex, { CreateTableBuilder, TableBuilder } from 'knex';

async function main() {
  const knex = Knex({
    client: 'pg',
    connection: {
      user: 'postgres',
      host: 'localhost',
      database: 'personalitea',
      password: 'NoodleCup3'
    }
  })

  await createUsersTable(knex);
  await createDrinksTable(knex);
  await createIngredientsTable(knex);
  await createDrinkIngredientsTable(knex);
  await createRelationships(knex);

  process.exit(0);
};


async function createUsersTable(database: Knex) {
  const tableName = 'users';
  const hasTable = await database.schema.hasTable(tableName);

  if (hasTable) {
    console.log(`${tableName} exists!`)
    return;
  }

  await database.schema.createTable(tableName, (tableBuilder: CreateTableBuilder) => {
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
    console.log(`${tableName} exists!`)
    return;
  }

  await database.schema.createTable(tableName, (tableBuilder: CreateTableBuilder) => {
    tableBuilder.increments('id').primary();
    tableBuilder.string('name');
    tableBuilder.integer('owner');
  });
}

async function createIngredientsTable(database: Knex) {
  const tableName = 'ingredients';
  const hasTable = await database.schema.hasTable(tableName);

  if (hasTable) {
    console.log(`${tableName} exists!`)
    return;
  }

  await database.schema.createTable(tableName, (tableBuilder: CreateTableBuilder) => {
    tableBuilder.increments('id').primary();
    tableBuilder.string('name').unique();
    tableBuilder.integer('owner');
  });
}


async function createDrinkIngredientsTable(database: Knex) {
  const tableName = 'drink_ingredients';
  const hasTable = await database.schema.hasTable(tableName);

  if (hasTable) {
    console.log(`${tableName} exists!`)
    return;
  }

  await database.schema.createTable(tableName, (tableBuilder: CreateTableBuilder) => {
    tableBuilder.integer('drink_id');
    tableBuilder.integer('ingredient_id');
  });
}

async function createRelationships(database: Knex) {
  // Create drink_ingredients.drink_id -> drinks.id
  await database.schema.alterTable('drink_ingredients', (tableBuilder: TableBuilder) => {
    tableBuilder.foreign('drink_id').references('drinks.id');
  });

  // Create drink_ingredients.ingredients_id -> ingredients.id
  await database.schema.alterTable('drink_ingredients', (tableBuilder: TableBuilder) => {
    tableBuilder.foreign('ingredient_id').references('ingredients.id');
  });
}


main();
