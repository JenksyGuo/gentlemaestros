# Gentle Maestros Shopify Deployment

This directory is the source of truth for the Gentle Maestros Shopify theme.

## Branches

- `dev` deploys automatically to the unpublished Gentle Maestros dev theme.
- `main` deploys automatically to the production Gentle Maestros store.
- Feature work should branch from `main` and merge through pull requests.

## Required GitHub Variables

Repository variables:

- `SHOPIFY_STORE_DEV`: `gentle-maestros.myshopify.com`
- `SHOPIFY_THEME_ID_DEV`: `189204169076`
- `SHOPIFY_STORE_PROD`: `gentle-maestros.myshopify.com`
- `SHOPIFY_THEME_ID_PROD`: `189208985972`
- `SHOPIFY_DEPLOY_ENABLED`: `false` until Theme Access tokens are installed, then `true`

## Required GitHub Secrets

Repository secrets:

- `SHOPIFY_CLI_THEME_TOKEN_DEV`
- `SHOPIFY_CLI_THEME_TOKEN_PROD`

Create these with Shopify's Theme Access app. Each token should have theme write access for the matching store.

The public GitHub repo keeps the Shopify source under `shopify/gentlemaestros_shopify`.
Root workflows use that directory as their working directory so Hermes can push Liquid changes
without replacing the static landing-page history.

## Flow

1. Open a feature branch from `main`.
2. Open a pull request into `dev` or `main`.
3. GitHub Actions runs Theme Check and packages the theme.
4. A successful merge to `dev` deploys to the unpublished dev theme.
5. A successful merge to `main` deploys to production.

## Launch Notes

- Store name: `Gentle Maestros`
- Shopify store handle: `gentle-maestros.myshopify.com`
- Live theme: `Gentle Maestros Performance Fix` (`189208985972`)
- Dev theme: `Gentle Maestros Dev Theme` (`189204169076`)
- Default generated theme retained: `Horizon` (`189203448180`)
- Primary domain: `gentlemaestros.com.au`
- Shopify domain status: connected as primary domain; TLS provisioning started May 19, 2026.
- DNS note: Shopify recognized the apex as connected, but Bluehost authoritative DNS edges were still inconsistent immediately after setup. Recheck `@`, `www`, and MX before final go-live.
- Support email: `hello@gentlemaestros.com.au`
- Theme base: `yunkid-home-1.zip`
- Initial positioning: music-inspired learning toys, sensory-friendly play, early rhythm, and creativity.
