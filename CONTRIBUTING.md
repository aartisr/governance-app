# Contributing to Civic Accord

Thank you for helping improve Civic Accord. Contributions should preserve the project's transparency, explainability, accessibility, and prototype limitations.

## Before you start

- Check existing issues and pull requests to avoid duplicating work.
- For a substantial change, open an issue first to agree on the problem and approach.
- Do not include secrets, personal data, or unlicensed third-party material.
- Keep claims about civic, legal, or policy outcomes evidence-based; the application's data and simulations are illustrative.

## Development setup

1. Install Node.js 22 and npm 10 or newer.
2. Clone the repository and run `npm install`.
3. Provide only the environment variables needed for your work. Never commit credentials.
4. Start the app with `npm run dev`.

## Make and verify a change

Keep pull requests focused and update documentation when behavior or setup changes. Before submitting, run:

```bash
npm run typecheck
npm test
npm run build
npm audit --audit-level=low
```

Include or update tests for behavior changes. If a check cannot be run, explain why and what remains unverified in the pull request.

## Pull requests

- Describe the problem, the change, and any important trade-offs.
- Link related issues and include screenshots for visible UI changes.
- Call out changes to data assumptions, external services, environment variables, or user-facing limitations.
- Confirm that no secrets or unrelated generated files are included.

By submitting a contribution, you agree that it may be distributed under the project's [MIT License](LICENSE).
