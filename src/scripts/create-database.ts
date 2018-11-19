import Knex from 'knex';
import { S_IFBLK } from 'constants';

async function main() {
  const knex = Knex({
    client: 'pg',
    connection: {
      user: 'nathan',
      host: 'localhost',
      database: 'personalitea',
      password: 'ilostit12'
    }
  })


  // Create users
  const userTableDefinition: TableDefinition = new TableDefinition(true,
    [
      new RowDefinition(RowType.string, 'name'),
      new RowDefinition(RowType.string, 'email'),
      new RowDefinition(RowType.integer, 'password'),
    ]
  );

  // Create Drinks
  const drinksTableDefinition: TableDefinition = new TableDefinition(true,
    [
      new RowDefinition(RowType.integer, 'owner'),
      new RowDefinition(RowType.string, 'name'),
    ]
  );

  // Create ingredients
  const ingredientsTableDefinition: TableDefinition = new TableDefinition(true,
    [
      new RowDefinition(RowType.integer, 'owner'),
      new RowDefinition(RowType.string, 'name'),
    ]
  );

  // Create drink ingredients
  const drinkIngredientsTableDefinition: TableDefinition = new TableDefinition(false,
    [
      new RowDefinition(RowType.integer, 'drink_id', { unsigned: true }),
      new RowDefinition(RowType.integer, 'ingredient_id', { unsigned: true }),
    ]
  );

  await createTable(knex, 'users_t', userTableDefinition);
  await createTable(knex, 'drinks_t', drinksTableDefinition);
  await createTable(knex, 'ingredients_t', ingredientsTableDefinition);
  await createTable(knex, 'drink_ingredients_t', drinkIngredientsTableDefinition);

// create relaltionships

  await createRelationship(knex, new RowRelationship('drink_ingredients_t', 'drink_id', 'id', 'drinks_t', 'cascade'))
  await createRelationship(knex, new RowRelationship('drink_ingredients_t', 'ingredient_id', 'id', 'ingredients_t', 'cascade'))

  process.exit(0);
};


// TODO: clean this shit up.
async function createTable(knex: Knex, tableName: string, tableDefinition: TableDefinition) {
  await knex.schema.hasTable(tableName).then(async (exists) => {
    if (exists) {
      console.log(`${tableName} already exists, not creating`);
      return;
    }

    console.log(`Creating table: ${tableName}`);

    await knex.schema.createTable(`public.${tableName}`, async (table: Knex.TableBuilder) => {
      if (tableDefinition.hasId) {
        table.increments('id').primary();
      }
      tableDefinition.rows.forEach(async (row: RowDefinition) => {
        console.log(`Creating row: ${row.name}`);

        const columnBuilder = table[row.type](row.name);

        if (row.options.unsigned) {
          columnBuilder.unsigned();
        }
      })
    });
  })
}

async function createRelationship(knex: Knex, rowRelationship: RowRelationship) {
  console.log(`Creating relationship:
  ##: ${rowRelationship.table}.${rowRelationship.column} -> ${rowRelationship.referenceTable}.${rowRelationship.referenceColumn}`);
  await knex.schema.alterTable(rowRelationship.table, async (table) => {
    await table
      .foreign(rowRelationship.column)
      .references(`${rowRelationship.referenceTable}.${rowRelationship.referenceColumn}`);
  });
}

class TableDefinition {
  constructor(public hasId: boolean, public rows: RowDefinition[]) {
  }
}

class RowDefinition {
  constructor(public type: RowType, public name: string, public options: any= {}) {
  }
}

enum RowType {
  string = 'string',
  integer = 'integer',
  boolean = 'boolean'
}

class RowRelationship {
  constructor (
    public table: string,
    public column: string,
    public referenceColumn: string,
    public referenceTable: string,
    public onDelete: string
  ) { }
}



main();
