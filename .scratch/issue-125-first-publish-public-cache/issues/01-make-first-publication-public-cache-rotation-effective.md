# Make first-publication Public Cache rotation effective

Status: ready-for-agent
Blocked by: None

## Parent

[Issue #125 Public Cache invalidation spec](../PRD.md)

## What to build

A fresh deployment that has cached an empty public Post list must show the first Published Post after the publication Workflow completes and the Cloudflare KV generation update propagates. Public Cache invalidation must rotate to a unique opaque generation without relying on a numeric read-modify-write cycle, and infrastructure failures must not silently revive or preserve stale data.

## Acceptance criteria

- [ ] An absent generation key resolves to the bootstrap generation `v0` without requiring a seeding or migration step.
- [ ] Each invalidation writes a new opaque generation token without first reading or incrementing the current token.
- [ ] Existing non-empty numeric generation values remain valid cache identities after upgrade.
- [ ] Failure to read a generation causes the affected public read to return current D1 data instead of selecting a fallback Public Cache generation.
- [ ] Failure to write a new generation is observable to the invalidation caller so the publication Workflow can retry the step.
- [ ] A regression test starts with a fresh generation namespace, caches an empty unfiltered Post list, publishes the first Post through the existing Workflow, repeats the same request, and observes the Published Post.
- [ ] The regression test does not add a Tag filter, rotate twice, manually purge the data cache, or otherwise bypass the original request identity.
- [ ] Tests that currently require two bumps or assert that the first bump leaves the effective generation unchanged are rewritten to express the corrected behavior.
- [ ] Focused infrastructure and Post integration tests, lint, and type checking pass.

## Comments
