# UHi production website

## Canonical source and release flow

This GitHub repository is the canonical source for uhi.vn. Use this repository
for future ChatGPT and Antigravity edits. The separate chatgpt.site prototype
does not synchronize into this repository automatically.

- Fetch the current main branch before each task and read current changes/PRs.
- Create a task branch; never push directly to main or overwrite another agent's branch.
- Implement and test the requested change, then open a pull request to main.
- Provide the Vercel Preview URL and the validation result to the owner.
- Wait for the owner's approval of that change before merging or promoting to production.
- Do not enable auto-merge. Do not alter DNS, sharing, production settings, secrets,
  or branch protection merely to bypass a failed preview.
- Do not treat a successful local build as proof that production changed.

## Existing behavior to preserve

- Meta Pixel ID 1117198146781464, initialized once.
- Lead form to FormSubmit at lyhu.vn@gmail.com.
- Hotline/Zalo FloatingCTA and current contact configuration.
- SEO, OpenGraph, existing working URLs and language support as implemented.
- Product packaging, UHi logo and approved product sizes. Do not invent label claims.
- No unpublished Hyundong brands in customer-facing content.

## Build and review

Use Node.js 22 and npm ci, then npm run build. Commit package-lock.json when
dependencies change. The GitHub PR build is a build check, not a manual approval
or a guarantee that Vercel is connected. Inspect Vercel's PR checks separately.

Keep credentials and customer information out of Git, preview URLs and logs.
Do not expose server credentials through Vite define or VITE_* variables.
Never rely on ChatGPT-injected identity headers as authentication on Vercel.

See docs/EDITING-AND-DEPLOYMENT.md for connection and acceptance steps.
