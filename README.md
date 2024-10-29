## Prerequisites

Ensure you have the following installed:

- Node.js (v18.x or later)
- Yarn (v1.22.0 or later)
- Npm (v10.5.0 or later)

## Convention:

1. File name of module: Kebab case.
2. Variable/Function: Camel case.
3. Coding standards and Style Guides: Use tools ESLint and Prettier.

## Rules Commit Messages and Branch

1. Use Descriptive Branch Names:

    - Structure:
      <required type>/<optional: Ticket>\_<required branch-name>

    - Type:
      Feature branches: feature/branch-name
      Bugfix branches: bugfix/branch-name
      Hotfix branches: hotfix/branch-name
      FIx branches: fix/branch-name
      Release branches: release/branch-name

   Examples:
   feature/add-user-authentication
   bugfix/#123456_fix-login-error

2. Commit Messages

    - Keep Messages Concise and Descriptive:
      Limit the subject line to 50 characters.
      Provide a detailed description if necessary, wrapped at 72 characters.
      Use the imperative mood (e.g., "Add feature" instead of "Added feature").

    - Structure:
      <required type>[optional scope]: <description>
      [optional body]
      [optional footer(s)]

    - Examples:
        - Commit message with no body: fix: Fix bug in user authentication
        - Commit message with scope : feat(lang): add Polish language
        - Commit message with body:
          feat: Add new user profile page
          Create a new user profile page that displays user information, recent activities, and settings.

## Before you push your commits, please make sure to follow these steps to ensure code quality and consistency:

Pre-Push Checklist:

```bash
1. Linting: Ensure code style and best practices are adhered to by executing:
	$ npm run lint:check

2. Code Formatting: Verify consistent code formatting with:
	$ npm run format

3. TypeScript Type Checking: Validate type correctness with:
	$ npm run type:check

4. Building the Application: Generate production-ready build artifacts by running:
	$ npm run build

-	All in one command:
	$ npm run lint:check && npm run format && npm run type:check && npm run build (for npm)
	$ yarn lint:check && yarn format && yarn type:check && yarn build (for yarn)

!!! These commands ensure code quality, adherence to standards, and the generation of a production-ready build.
```

## Installation

```bash
$ npm install
```

## Database:

```bash
If you don't have a MySQL server installed, you can use Docker to create one. Follow these steps:
1. Ensure Network Exists:
- Make sure you have a Docker network named space-study-api.
- You can list all Docker networks with the following command:
	`docker network ls`
- If the network doesn't exist, create it with the following command:
	`docker network create space-study-api`
2. Create PostgreSQL Database:
- Run the following command to create a PostgreSQL database in Docker and connect it to the space-study-api network:
	`docker-compose -f docker-compose-postgres.yml up -d`
3. Verify PostgreSQL Container:
- Ensure the PostgreSQL container is running by listing all Docker containers:
	`docker ps`
```

## Migration Data(lib TypeORM):

```bash
1. Using CLI Commands:
- Create a Migration: To create a new migration file, use the following command:
	$ npm run migration:create --name=MigrationName

Replace MigrationName with a descriptive name for your migration. This command will create a new migration file in the designated migration directory.

- Generate a Migration: To generate a new migration file based on changes in your entities, use the following command:
	$ npm run migration:generate --name=MigrationName

Replace MigrationName with a descriptive name for your migration. This command will generate a migration file that reflects the changes made to your entity files.

- Run All Migrations: To run all pending migrations and apply them to the database, use the following command:
	$ npm run migration:run

This command will execute all the migrations that have not yet been run, updating your database schema accordingly.

- Additional Notes:
Migration Directory: Ensure that your migration files are placed in the correct directory specified in your TypeORM configuration file (e.g., ormconfig.json or equivalent).
Reverting Migrations: If you need to revert the last migration, you can use the following command:
	$ npm run migration:revert

This command will revert the most recently applied migration.
```

## Running the app

```bash
# development
	$ npm run start

# watch mode
	$ npm run start:dev

# production mode
	$ npm run start:prod
```

- **Visual Studio Code**: Ensure you have Visual Studio Code installed on your machine.
- **Docker**: Install Docker Desktop for your operating system.

### Running the Development Container

- Open the Command Palette:
  Press Ctrl+Shift+P (Windows/Linux) or Cmd+Shift+P (macOS) to open the Command Palette.
- Remote-Containers: Reopen in Container
  Type Remote-Containers: Reopen in Container in the Command Palette and select it.
- Select a DevContainer Configuration
  If prompted, choose the appropriate configuration from .devcontainer/devcontainer.json. This file defines the settings
  for your development container, including Dockerfile or Docker Compose configurations.
- Wait for Container Setup
  VS Code will build the Docker image and set up the development container according to the configuration specified.
- Start Developing
  Once the container is built and started, you'll be working inside the development container environment.
  VS Code will automatically install any specified extensions and configure the environment as defined in
  devcontainer.json.

```
