---
title: "How to Safely Run Database Migrations"
pubDate: "24 June, 2026"
description: "A practical checklist for safer database migrations."
featured: true 
readingTime: "10 min read"
---

The first time you design a database schema, it can feel more permanent than the rest of your code.

You create the ER diagrams, design the tables, choose the columns, add a few relationships, normalize the schema, putting into practice everything you learned from a very dry database book. Boyce and Codd could cry at how hard you normalized that data.

So, you implement it just how you envisioned it, deploy it, and the application works flawlessly.

Then the requirements change. Turns out, phone numbers are actually text, despite what your schema and the word "numbers" suggest. Or you need to split the name column into first_name and last_name (which is a bad idea[^1] but that's what the requirement says). Or a table that you were assured was "just for dumping data" now needs to be queried and needs an index.

Sure, you could do what you did when you were working alone and no one else was using your application: delete everything and start from scratch. Unfortunately, people tend to get upset when that data is important and needs to be kept.

More often, you will not be changing a schema you designed. You might be joining a project where the database already has years of decisions, shortcuts, and data in it. The problem is the same: the database needs to change, is not empty, and other code already depends on it.

Either way, this is the part of database work you are much more likely to do at your job than normalizing to BCNF.

So, what can you do? That is the problem migrations are meant to solve.

## Migrating to a different state

The idea behind a migration is simple: changing the database structure. Doing it **safely** is where it gets hard. Making the change without losing data, breaking the application, or surprising the people who depend on it.

## The Migration Checklist

Here are a few things to consider before running a migration:

### What kind of migration is this?

I have to confess. I've been talking about two different types of migrations and putting them under a single term "migration" as if it means one thing. It is this conflation that results in a lot of migrations failing.

So, let me be a bit more accurate from now on and refer to them as what they are:

1. **Schema migrations**: Changes to the schema of the database like adding a column, creating a table, altering a column, adding an index. A schema migration may take locks or change what the application expects the database to look like.

<details>
<summary>What is a lock?</summary>

A lock is a way for the database to control who can read or write a row, table, or other objects while another operation is using it. Some locks only block writes. Some block reads too.
</details>

2. **Data migrations**: Changing the data that already exists. It can involve backfilling values, copying data into a new column, splitting existing values, deleting rows.

These two kinds of work have different risks and must be tackled differently.

### Keep schema and data changes separate

Often, a database migration involves doing both of these. You change the schema of the table and then you need to change the data to match the new schema.

It is very important that they happen separately and here's why:

<u>Schema changes should be as short and predictable as possible</u>

If you have a long-running data migration, the schema migration may have to compete for the same table, causing lock waits and making the migration take longer than necessary.

If a schema change can lock the table for a long time, like adding an index, then it might be better to treat it as its own operation and run it separately from your other schema changes.

A data migration may need to touch thousands or millions of existing rows. You would often batch those changes, with each batch wrapped in its own transaction, instead of doing everything in one pass. Each batch should be atomic - either the whole batch is written, or none of it is. This is so that if the migration fails halfway through, or needs to be paused, it can be resumed without duplicating work.

<details>
<summary>What is batching?</summary>

Let's say that you need to update a column for 10 million rows. You could update all 10 million in one go, but that may hold locks for too long. Instead, you can split the work into smaller batches like 10,000 rows at a time.

</details>

Depending on the database, certain schema operations can trigger an implicit commit. Yes, implicit commits are a thing and yes, I found out the hard way.

<details>
<summary>What is an implicit commit?</summary>

Usually, when you start a transaction, you have to explicitly `COMMIT` for the database to write the changes.

An implicit commit is when the database commits the current transaction automatically before or after running a statement.
</details>

Suppose you are performing several insert operations inside a transaction, and in the middle, you run a statement that triggers an implicit commit. The inserts made so far will be committed immediately. A later rollback cannot undo those anymore. If a bad query runs after that, the rest of the migration may fail, but the earlier updates are already committed.

```sql
START TRANSACTION;

INSERT INTO users (name) VALUES ('Al');
INSERT INTO users (name) VALUES ('Bob');

ALTER TABLE users ADD COLUMN age INT; -- The statement forces an implicit commit.
-- Al, Bob, and the new age column have been committed

INSERT INTO users (non_existing_column) VALUES (0); -- Fails

ROLLBACK; -- This cannot undo Al, Bob, or the schema change.
```

If the table is tiny, combining the two may be fine. But for any significant amount of data, separation gives you much better recovery options.

### Is this destructive or non-destructive?

A destructive change is a change that can permanently remove data, make existing data invalid, or break application functionality. Obviously, not good. Dropping tables, deleting columns, changing column types, or removing allowed values are all destructive.

Non-destructive changes are additive. Existing code and queries can continue working while the new schema is introduced. Adding a nullable column, creating a table, and adding an index are usually non-destructive.

Usually is doing some work there.

### Will this break the existing application?

Non-destructive does not mean risk-free. Adding an index can still lock a large table. Adding a column with a default can still be expensive depending on the database. Adding a nullable column is fine. Renaming a column is not. Adding a `NOT NULL` column without a default may break old code that inserts rows without that value.

<u>A migration can be non-destructive and still break the application.</u>

Whether this is a problem depends on your deployment strategy. If you can take downtime, you may be able to stop the application, run the migration, deploy the new code, and start everything again. If you want the application to stay online, the old and new code may both need to work with the database for a while.

For zero-downtime migrations, the [blue/green deployment](#bluegreen-deployments) or [expand and contract pattern](#expand-and-contract-pattern) deployment strategies may be used.

During deployment, do not assume every copy of your application updates at the exact same time. One server, worker, or cron job may still be running the old code while the new schema is already in place.

The safer path is usually to make the database accept both the old and new application behavior for a while.

### How much data will this touch?

A backfill is when you update existing rows so they match a new schema. Backfills are data migrations, so they should be treated differently from schema changes. If the table is large, run the backfill in batches and make it safe to pause and resume.

<details>
<summary>What can be considered a backfill?</summary>

Adding a new column is not the backfill. Populating that column for the rows that already exist is the backfill.

Common examples include:

- filling a new column for existing rows
- calculating a new value from existing columns
- copying data from an old column to a new column
- normalizing old values into a new format
- creating missing relationship records
- fixing incomplete values before adding a constraint
</details>

Touch does not always mean change, though.

Adding an index may not change any row but the database may still need to scan the table. Changing a column type may require the database to rewrite the table internally.

Before running the migration, you should know if an operation is cheap or whether it will touch a lot of existing data. If it touches existing data, estimate how much the database needs to read, update, validate, copy, or rewrite.

<details>
<summary>How can large table migrations be handled?</summary>

For large tables, one strategy is to create a new table with the updated schema, copy data into it in batches, and then swap the tables by renaming them. This can reduce the time spent rewriting the original table, but it is not free. You can exhaust the transaction logs and you still need to handle indexes, foreign keys, new writes that happen during the copy, and the final swap.

Tools like `pt-online-schema-change` and `gh-ost` use a version of this idea for MySQL.

If old data is rarely used and the application has a real active/archive distinction, archiving old rows before the migration may also reduce the amount of data touched.

</details>

### Did you test it with the production-like setup?

The classic "Worked on my machine" problem.

Your local setup (and sometimes the staging environment) may be set up differently than the production server. You might have a different distribution, version, engine, memory limit, transaction log limits, lock wait timeout, statement timeout, replication, permissions.

Your local database may also have data that is too small or too clean. Production might have millions or billions of records with missing values, duplicate values, and edge cases.

This is a common reason migrations (and applications) fail and often goes unnoticed until it is too late and production is down.

Hopefully, your staging database is already set up like the production database. If it's not, try to make it that way, at least the configuration, but ideally some (sanitized) production data as well.

If that can't happen, a replica of the production database can be useful, but be very careful. Make it temporary or disposable so you don't cause replication lag, affect traffic, or break failover assumptions.

<details>
<summary>What's replication?</summary>

The database copies and maintains duplicates of its data across multiple servers.
</details>

### What is the recovery plan?

What can go wrong, well, can go wrong. You can't avoid failure every time but you can be prepared.

#### Schema migrations

Here's a lukewarm take:

<u>Most breaking database changes are optional</u>

As long as it is non-destructive, decoupled, and doesn't break existing functionality, you can almost always[^2] roll forward when things go wrong.

#### Data migrations

Data migrations are different.

A failed query is the easier problem. If the batch is wrapped in a transaction, the database can throw away that batch and you can try again.

The harder problem is a migration that succeeds but writes the wrong data. Rolling forward may not be enough. You need to know what changed, which rows were affected, and whether the migration can be safely resumed or reversed.

You should have backups. More specifically, you should know whether you can restore the affected data without restoring the entire database and ruining everyone else's day.

### How will this migration run?

A migration is not only the SQL statements. You also need to know what will run it.

1. <u>**Manual .sql file**</u>: You might run a plain `.sql` script directly against the database.

It can:
- be fast to execute
- use features your ORM does not support well
- give you tight control of the migration

Risks:

- no migration history unless you keep track of it
- harder to repeat consistently across environments
- difficult in multi-tenant setups

2. <u>**Migration tools**</u>: You might use a migration tool like Knex, Flyway, Liquibase, Laravel migrations. You write the migration file, and they handle tracking and execution.

They can:

- track which migrations ran
- run rollbacks
- be helpful in multi-tenant systems
- keep migrations in order
- keep migration files in the repo
- apply the same change across environments
- let you run any custom code around migration, such as enqueue a backfill job

Risks:

- let you run any custom code around migration, such as huge data migrations or making long API calls
- might not support every database feature you need
- if you run the migration tool during application startup or runtime, the app may need to scan migration files and check the migration table before it starts. With enough files or tenants, this can impact performance

3. <u>**ORM Migration Generators**</u>: You might use an ORM that generates migrations from model changes. Examples include: Prisma, TypeORM, Sequelize, etc.

They can:

- generate migrations from model/schema changes
- reduce boilerplate
- keep application models and database schema aligned
- help in multi-tenant systems if the migration workflow supports it

Risks:

- they may produce destructive changes
- they may choose a naive operation for large tables
- they may not understand your deployment order or data backfill needs


### When will the migration run?

1. <u>**CI/CD**</u>: Migrations run as part of your CI/CD before deploying the new application version. Whenever a change is pushed, the CI/CD pipeline runs the migration against the staging database. The advantage is that it allows you to catch any problems before they reach production. The downside is that a slow production migration can block the deployment pipeline.

2. <u>**Application Startup**</u>: Migrations run every time the application starts. This can be acceptable for single-instance applications but it gets risky with multiple instances. You do not want five copies of your application all deciding to migrate the database at the same time. This can go bad if your migration method does not have reliable locking (learned that the hard way too). Depending on the number of migrations and how long they run, it can also slow down the application startup times.

3. <u>**Application runtime**</u>: Useful for systems that may not be able to migrate everything at once, like multi-tenant systems. You might need to migrate tenant by tenant, run background jobs, or let the application handle old and new schema versions for a while. One thing to be aware of is that every time the application acquires a new connection to the tenant database, it will at least run a pending migration check, which can result in slow response times. Pooling connections can help, but it can exhaust connection limits and application memory.

### What deployment strategy fits this migration?

By this point, you should know what kind of migration you are dealing with. Is it a schema change only? Does it move data? Is it destructive? Does it need a backfill? Can old and new application code both run? How much data will it touch?

The strategy depends on those answers. You can also combine one or more strategies[^3].

#### Migration with downtime

The simplest strategy is to just make the database unavailable for the duration of the migration.

It is a valid strategy and for some use cases it might be good enough like internal tooling, or cases where the migration is risky to run while users are active.

Of course, if the goal is to not affect your users and maintain availability during migration, this might be the "less than ideal" strategy. Also, downtime does not magically make a bad migration safe. You still need backups, a recovery plan, and a realistic estimate of how long the migration will take.

#### Blue/Green deployments

The idea here is to have 2 instances (one blue, one green) and one of them is receiving production requests and the other is not.

The migration is executed on the instance that is not receiving any production requests (say green). Once the migration is complete, we switch the instances (green receives production requests, while blue stops receiving requests).

The advantage here is that if there are issues with the changes, we can switch back to the previous instance and the application returns to the last known working state.

Well... ideally that is what should happen. There are a few problems that can happen:

1. If there are destructive schema changes, even reverting to the previous instance might cause issues. We can avoid this by ensuring the schema changes are [non-destructive](#is-this-destructive-or-non-destructive).

2. The newly switched (green) instance might have received data that the old one did not. If we have to switch to the old one, the inconsistency between the two will become a consideration. To avoid this, the database should be replicating.

#### Expand and Contract Pattern

> [Prisma.io has a more in-depth guide with examples on using the expand and contract pattern](https://www.prisma.io/dataguide/types/relational/expand-and-contract-pattern)

For zero-downtime migrations, this is often considered the gold standard.

The idea here is to migrate in multiple steps.

1. Design and deploy the desired schema alongside the original schema.

2. Modify the client code to write changes to both schemas simultaneously.

3. Migrate existing data from the original schema to the new schema, modifying it as necessary to conform to the new schema.

4. Test the new schema to ensure that it is functionally correct and that the data has been transferred correctly.

5. Modify the client code to begin reading data from the new schema.

6. Modify the client code to stop writing to the original schema. Remove the original schema.

The clear advantage of this strategy is that it ensures that the new schema is being used without directly affecting the client-facing responses (assuming the schema changes are non-destructive).

It does take longer to follow all the steps and requires constant monitoring. Testing the correctness of data transfer and testing that the application is functioning correctly after modifying the client code can take weeks.

## Conclusion

Like everything in software engineering, the "safe migration" is a matter of trade-offs.

Sometimes downtime is fine. Sometimes a migration tool is enough. Sometimes the safest option is a carefully reviewed SQL script, a backup, and someone watching the database while it runs.

The goal is to know where the risks are. Even if the recommendations and tips in this article don't apply directly to your situation, I hope they still serve as a starting point and help you make the "safest migration" for your situation.

[^1]: https://stackoverflow.com/a/7417826

[^2]: I say "almost always" in case I am missing a scenario but in practice I have never come across a scenario where we had to write a breaking migration.

[^3]: This section only discusses three strategies in light of the previous sections. [This article from Prisma discusses more strategies and their combinations](https://www.prisma.io/dataguide/types/relational/migration-strategies)