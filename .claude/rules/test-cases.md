# Test cases

A Ticket's tests are built from the test cases on its PRD. This rule binds the plan, the code and the review of every Ticket and every Bug.

## Resolving a Ticket's selector

A Ticket's `## Test cases` section is a **selector**: it names a PRD and requirement ids, such as "the cases in the `## Test cases` comment on #57 whose requirement is REQ-57.3". Resolve it before planning:

1. Fetch the PRD's comments: `gh issue view <PRD> --json comments`. Read every comment headed `## Test cases`, and its continuations `## Test cases (2 of 2)` and on.
2. Keep each `### TC-…` case whose `Requirement:` line names a selected id. A case under a `Retires:` line of a later PRD's comment is retired, not selected.
3. A **negative** case becomes a unit test in this Ticket's pull request, run by `npm run check`. A **positive** case becomes an end-to-end test, written by the `test(e2e):` Ticket alone.

The selected cases are the Ticket's spec as much as its acceptance criteria.

## Planning a case

The plan copies each selected case **word for word**: its id and title, `Given`, `Steps` and `Expected`, as the PRD's comment has them. Beside each, the test it becomes: the file, and the test's title. A selector with no case of a kind this Ticket writes is stated in the plan, with no test for it.

## A test's title

- A test's title starts with its case's id: `test("TC-57.4 Locked out after three wrong passwords", …)`.
- An end-to-end test is also tagged with its requirement and its priority: `test("TC-57.4 Locked out after three wrong passwords", { tag: ["@REQ-57.3", "@high"] }, async ({ page }) => { … })`.
- The test follows its case's steps and asserts its `Expected`.

## The `test(e2e):` Ticket

- One end-to-end test under `e2e/tests/` for every positive case it selects.
- Every case its PRD retires (each `Retires:` line in the PRD's `## Test cases` comment) has its test deleted, or rewritten as the test of the case that replaces it. No test is left titled with a retired case's id.
- A lane does not run the end-to-end tests: QA: Review runs them. `npx playwright test -c e2e --list` confirms they load.

## A Bug's repro

A Bug's `## Test case` comment holds its case, a red command and the repro test. The repro test becomes the case's test: a unit test for a negative case, an end-to-end test for a positive one.

1. Add the repro test and run the red command. See it fail for the reported reason: **red**.
2. Fix the code, and see the same command pass.
3. Commit the repro test and its fix together, in one commit, through the pre-commit hook. Every commit passes the hook; `--no-verify` is never used.

## A restored Bug

A Bug with a `## Restores` comment is built on a branch whose first commit restores reverted work: it reverts the revert commits that comment names. That **restore commit** is already on the branch when the plan is written. The plan builds the fix on top of it and leaves it as it is.

The reviewer reviews the restore commit only for being **exact**: its diff is the reverse of the revert commits' diff. Check with `git diff <restore>^ <restore>` against `git diff <newest revert> <oldest revert>^`. Its code is not reviewed again.

## Reviewing

Every selected case has its test, titled with its id, and every end-to-end test carries its two tags. A case with no test, or a test that does not follow its case, is a finding.
