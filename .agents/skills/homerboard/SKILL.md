```markdown
# homerboard Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns of the `homerboard` repository, a TypeScript React project. You'll learn the project's coding conventions, commit message style, file organization, and how to write and structure tests. This guide ensures consistency and efficiency when contributing to the codebase.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names.
  - Example: `userProfile.tsx`, `dashboardHeader.ts`

### Import Style
- Use **alias imports** for modules.
  - Example:
    ```typescript
    import { UserCard } from 'components/userCard';
    ```

### Export Style
- Use **named exports** exclusively.
  - Example:
    ```typescript
    export const UserProfile = () => { /* ... */ };
    ```

### Commit Messages
- Follow the **Conventional Commits** format.
- Allowed prefixes: `chore`, `feat`, `refactor`
- Keep commit messages concise (average 47 characters).
  - Example:
    ```
    feat: add user profile card component
    chore: update dependencies
    refactor: simplify dashboard logic
    ```

## Workflows

### Creating a New Feature
**Trigger:** When adding new functionality  
**Command:** `/new-feature`

1. Create a new file using camelCase naming.
2. Implement the feature using React and TypeScript.
3. Use alias imports for dependencies.
4. Export components using named exports.
5. Write corresponding tests in a `*.test.*` file.
6. Commit changes with a `feat:` prefix and a concise message.

### Refactoring Code
**Trigger:** When improving or restructuring existing code  
**Command:** `/refactor`

1. Identify code to refactor.
2. Update the code, maintaining camelCase file names and alias imports.
3. Ensure all exports remain named.
4. Update or add tests as needed.
5. Commit changes with a `refactor:` prefix and a clear message.

### Chore Tasks
**Trigger:** For maintenance tasks (e.g., dependency updates, configs)  
**Command:** `/chore`

1. Make the necessary maintenance changes.
2. Ensure coding conventions are followed.
3. Commit changes with a `chore:` prefix and a brief description.

## Testing Patterns

- Test files follow the `*.test.*` pattern (e.g., `userProfile.test.tsx`).
- Testing framework is **unknown**; check existing tests for framework clues.
- Place tests alongside the files they test or in a dedicated `__tests__` directory.
- Example test file:
  ```typescript
  // userProfile.test.tsx
  import { render } from '@testing-library/react';
  import { UserProfile } from './userProfile';

  test('renders user profile', () => {
    const { getByText } = render(<UserProfile />);
    expect(getByText('Profile')).toBeInTheDocument();
  });
  ```

## Commands
| Command        | Purpose                                      |
|----------------|----------------------------------------------|
| /new-feature   | Start a new feature implementation           |
| /refactor      | Begin a code refactor                        |
| /chore         | Perform a maintenance or configuration task  |
```
