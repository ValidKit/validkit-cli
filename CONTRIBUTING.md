# Contributing to ValidKit CLI

We love your input! We want to make contributing to ValidKit CLI as easy and transparent as possible.

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semicolons, etc)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

### Examples
```
feat: add webhook support for async batch processing

fix: correct retry logic for rate-limited requests

docs: update CLI examples for bulk validation

perf: optimize batch processing for large email lists
```

## Pull Request Guidelines

### Before Creating a PR

1. Fork the repo and create your branch from `main`
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes following our code style
3. Write/update tests for your changes
4. Run the test suite and ensure all tests pass
5. Update documentation if needed

### Commit Your Changes

Follow our commit convention:
```bash
# Single line commit
git commit -m "feat: add new validation option"

# Multi-line commit with details
git commit -m "feat: add batch validation progress" -m "- Show progress bar for large batches
- Add --no-progress flag to disable
- Update examples in README"
```

### PR Title and Description

Your PR title should follow the same convention as commits:
- `feat: add batch progress indicator`
- `fix: correct timeout handling`
- `docs: update CLI examples`

In your PR description, include:
1. **What** - Brief description of changes
2. **Why** - The motivation or issue being solved
3. **How** - Technical approach (if not obvious)
4. **Testing** - How you tested the changes
5. **Screenshots** - If applicable

Example PR description:
```markdown
## What
Adds a progress bar for batch validation operations

## Why
Users processing large email lists need feedback on progress
Closes #123

## How
- Uses ora spinner for progress indication
- Updates every 100 emails processed
- Can be disabled with --no-progress flag

## Testing
- Tested with batches of 100, 1000, and 10000 emails
- Verified --no-progress flag works correctly
- Confirmed JSON output mode suppresses progress
```

### After Creating Your PR

1. Ensure all CI checks pass
2. Respond to code review feedback
3. Keep your PR up to date with `main`
4. Squash commits if requested

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/validkit-cli.git
cd validkit-cli

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the project
npm run build

# Run tests
npm test
```

## Code Style

- We use TypeScript strict mode
- Follow existing code patterns
- Use meaningful variable names
- Add JSDoc comments for public APIs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue with your question or contact support@validkit.com.