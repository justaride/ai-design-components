# AI Design Components — justaride fork

Public fork of [`ancoleman/ai-design-components`](https://github.com/ancoleman/ai-design-components), retained to experiment with and extend the upstream Claude-skill/design-component collection.

| Field | Value |
|---|---|
| **Status** | Public fork with one local commit beyond the recorded upstream base |
| **Last reviewed** | 2026-08-12 |
| **This repository** | `justaride/ai-design-components` |
| **Upstream** | `ancoleman/ai-design-components` |
| **Recorded fork base** | upstream commit `76551b7b19ebc667764ec75da14990d0aef8b6e5` |
| **Local change commit** | `c141a96e6766434f87deb2ba41967492727c8f65` |
| **License** | MIT; preserve upstream notices and review third-party components individually |
| **Canonical upstream docs** | Use the upstream repository/site for upstream installation and skill documentation |

> [!IMPORTANT]
> This fork is not the canonical distribution of AI Design Components. The previous README presented upstream badges, URLs, skill counts, installation commands, and documentation as though they described this fork's maintenance state. Use upstream documentation for the upstream product, and this README for local fork differences and maintenance decisions.

## Local purpose and changes

GitHub identifies this repository as a fork of `ancoleman/ai-design-components`. Compared with the recorded upstream base, the fork is one commit ahead:

`feat(dashboard): add typed data model, drilldowns, and incident workbench`

The local commit primarily extends:

- `demo/examples/palo-alto-security-dashboard/`
- a dedicated GitHub Actions build workflow for that example
- typed dashboard data/model logic
- filters, drill-downs, incident controls, sorting and workbench UI
- responsive/accessibility-oriented styles

The rest of the repository is inherited from upstream unless a later local change says otherwise.

## Upstream versus local truth

| Topic | Source of truth |
|---|---|
| Upstream skills, installation, plugin groups, docs, version and roadmap | upstream repository and upstream documentation |
| Local Palo Alto dashboard changes | this fork's local commit and example directory |
| Fork sync/divergence status | GitHub compare between upstream `main` and this fork's `main` |
| License/attribution | upstream `LICENSE`, notices, and individual third-party files |

Do not update upstream skill counts, badges, or installation instructions manually in this fork unless the fork is intentionally becoming an independent maintained distribution.

## Inspect and run the local dashboard example

```bash
cd demo/examples/palo-alto-security-dashboard
npm install
npm run dev
```

Build verification:

```bash
npm run build
```

The local workflow `.github/workflows/palo-alto-dashboard-ci.yml` runs the example build for changes under that directory.

## Data and security boundaries

The Palo Alto dashboard is an example/demo surface. Unless a separate data contract proves otherwise:

- displayed security events, incidents, KPIs, severity, status, assets and timelines are sample or modeled data
- a chart, incident row, trend or status is not a live security finding
- no production credentials, telemetry, customer data, IP addresses or incident records should be committed
- product/company names and visual language may require trademark/brand review
- the example must not imply endorsement by Palo Alto Networks
- accessibility and build success do not establish security accuracy or production readiness

Before connecting real data, define authentication, authorization, tenant isolation, retention, redaction, incident confidentiality, audit logging, rate limits, backend trust, and source provenance.

## Syncing with upstream

This fork should use an explicit maintenance strategy.

### If the fork is only a patch/demo experiment

1. keep the upstream relationship visible
2. periodically compare upstream `main` with this fork
3. rebase/merge only after reviewing conflicts and dependency/security changes
4. keep local work isolated and documented
5. contribute generally useful changes upstream where appropriate
6. archive the fork when the experiment is no longer needed

### If the fork is becoming an independent distribution

Before doing so:

1. rename/rebrand it clearly
2. document local ownership and support
3. replace upstream-only badges and installation URLs
4. establish independent release/versioning and security policy
5. audit all licenses, notices, names and documentation
6. define update policy for inherited skills and plugins

No such independent-distribution decision is documented today.

## Verification

For the local dashboard example:

```bash
cd demo/examples/palo-alto-security-dashboard
npm install
npm run build
```

For broader inherited content, use the upstream project's documented validation commands for the specific component being changed, but verify that those commands still exist in this fork before running or citing them.

Before publishing or installing from this fork:

- inspect the GitHub compare against upstream
- review the local commit and workflow
- scan dependencies and repository secrets
- verify MIT attribution and third-party notices
- avoid presenting upstream documentation/version/counts as fork maintenance evidence

## Recommended owner decision

Choose and record one of:

- **temporary demo fork** — retain the local example, periodically sync, then archive
- **upstream contribution branch** — submit the dashboard change upstream and remove the long-lived fork
- **independent maintained fork** — establish new name, ownership, releases and documentation

Until that decision is made, this repository remains an upstream fork with a specific local dashboard experiment.

## Maintenance rule

Update this README whenever the upstream base, local divergence, sync policy, local example, ownership, public installation guidance, or lifecycle changes. Preserve upstream attribution and never replace the local fork identity with unqualified upstream marketing copy.
