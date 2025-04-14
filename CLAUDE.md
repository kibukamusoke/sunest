# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Start development server: `npm run start:dev`
- Lint: `npm run lint`
- Format: `npm run format`
- Test: `npm run test`
- Test single file: `npm run test -- path/to/file.spec.ts`
- E2E tests: `npm run test:e2e`
- Prisma commands: `npm run prisma:generate`, `npm run prisma:migrate`, `npm run prisma:seed`
- Docker development: `docker-compose up` (requires Docker)

## Code Style
- **Formatting**: Use Prettier (2-space indentation, single quotes)
- **Naming**: PascalCase for classes/interfaces, camelCase for variables/methods, kebab-case for files
- **File organization**: Follow NestJS conventions (.service.ts, .controller.ts, .module.ts)
- **Error handling**: Use NestJS exceptions with descriptive messages
- **Types**: Strong typing with TypeScript, avoid `any` when possible
- **Imports**: Group by source (NestJS, external, internal)
- **Testing**: Use Jest with descriptive test cases and proper mocking
- **Documentation**: Use Swagger decorators for API endpoints

## Docker
When building Docker images, ensure to include build dependencies for bcrypt (`python3`, `make`, `g++`).