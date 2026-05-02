# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues in `whyleonardo/homerboard`. Use the `gh` CLI for all operations.

## Conventions

- **Create an issue**: `gh issue create --repo "whyleonardo/homerboard" --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --repo "whyleonardo/homerboard" --comments`, filtering comments by `jq` and also fetching labels when needed.
- **List issues**: `gh issue list --repo "whyleonardo/homerboard" --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --repo "whyleonardo/homerboard" --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --repo "whyleonardo/homerboard" --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --repo "whyleonardo/homerboard" --comment "..."`

Infer the repo from `git remote -v` when possible. The canonical remote is `https://github.com/whyleonardo/homerboard.git`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue in `whyleonardo/homerboard`.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --repo "whyleonardo/homerboard" --comments`.
