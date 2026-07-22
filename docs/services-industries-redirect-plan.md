# Services + Industries Consolidation Record

Status: Implemented in the working tree on July 10, 2026. `services.html` is now the public combined experience; public navigation, footer links, compatibility anchors, and the sitemap point to that canonical page. `industries.html` remains as a lightweight client-side compatibility redirect so known legacy fragments can map to their new destinations.

The original planning notes remain below as the implementation record. A platform-level permanent redirect can replace the compatibility document later, but fragment-specific mapping must be preserved because URL fragments are not sent to the server.

## Recommended canonical page

- **Recommended canonical URL:** `/services.html`
- **Reason:** Services is already the broader user intent, it has the largest number of internal links, and it can contain industry applications without forcing visitors through a chooser.
- **Private foundation preview:** `/services-industries-preview.html`
- The preview must remain unlinked and `noindex, nofollow`. It should never be added to the sitemap.

## Launch sequence

1. Approve the combined-page copy, claims, information hierarchy, and final visual direction.
2. Build the approved combined experience at `services.html`.
3. Preserve the old Services and Industries source content in version control and the content audit.
4. Add stable service, industry, capability, and account-model anchors.
5. Update internal links and verify quote-prefill behavior.
6. Add a permanent server-side redirect from `/industries.html` to `/services.html`.
7. Update canonical tags and sitemap.
8. Test old URLs, old anchors, query strings, keyboard behavior, and mobile layouts before deployment.

## Proposed old-to-new anchor map

### Existing Services anchors

| Existing URL | Future canonical target |
|---|---|
| `/services.html#linen` | `/services.html#linens-bedding` |
| `/services.html#towels` | `/services.html#towels-wellness` |
| `/services.html#uniforms` | `/services.html#uniforms-chef-coats` |
| `/services.html#event` | `/services.html#event-linens` |
| `/services.html#route` | `/services.html#route-return` |
| `/services.html#wholesale` | `/services.html#wholesale-support` |

Because URL fragments are not sent to the server, a server-side redirect cannot map each old fragment by itself. At launch, retain temporary compatibility anchors in the new `services.html`, or add a very small client-side fragment mapper on the canonical page.

### Existing Industries anchors

| Existing URL | Future canonical target |
|---|---|
| `/industries.html#hotel` | `/services.html#hotels` |
| `/industries.html#str` | `/services.html#str-property-managers` |
| `/industries.html#spa` | `/services.html#spa-wellness` |
| `/industries.html#gym` | `/services.html#gyms-fitness` |
| `/industries.html#event` | `/services.html#events-convention-centers` |
| `/industries.html#restaurant` | `/services.html#restaurants-food-service` |
| `/industries.html#uniform` | `/services.html#uniform-accounts` |
| `/industries.html#casino` | `/services.html#casinos-entertainment` |
| `/industries.html#wholesale` | `/services.html#wholesale-cleaners` |

At launch, the simplest robust compatibility option is to keep a lightweight `industries.html` redirect document long enough to map known fragments, then send users to the corresponding canonical anchor. A platform 301 should still handle fragment-free requests.

## Homepage links to update later

Do not update these during the foundation pass.

| Homepage program | Future target |
|---|---|
| Hotels & Boutique Stays | `services.html#hotels` or `services.html#linens-bedding` after final content hierarchy approval |
| Short-Term Rentals / Property Managers | `services.html#str-property-managers` |
| Spas, Massage & Wellness | `services.html#spa-wellness` |
| Gyms, Yoga & Fitness Studios | `services.html#gyms-fitness` |
| Event Linen Programs | `services.html#event-linens` |
| Restaurants & Food Service | `services.html#restaurants-food-service` |
| Uniforms & Casino Programs | Decision required: `#uniform-accounts` or a neutral combined entry point that links to both `#uniform-accounts` and `#casinos-entertainment` |
| Specialty Commercial Accounts | `services.html#specialty-cleaning` |

The Customer-Owned Goods and Rental routing links can later target `#customer-owned-goods` and `#rental`, or continue pointing to Pricing if that remains the preferred explanation.

## Navigation and footer changes to make only at launch

1. Remove the separate Industries primary-navigation item after `services.html` contains all approved industry content.
2. Keep Services as the single primary entry.
3. Remove or repoint the footer Industries link.
4. Update footer service anchors:
   - Commercial linen -> `#linens-bedding`
   - Towel service -> `#towels-wellness`
   - Uniform cleaning -> `#uniforms-chef-coats`
   - Event linen -> `#event-linens`
   - Wholesale support -> `#wholesale-support`
5. Search all HTML and JavaScript files for `industries.html`, old Services anchors, and quote links before release.

## Sitemap and canonical tags

At launch:

- Keep `/services.html` in `sitemap.xml`.
- Remove `/industries.html` from `sitemap.xml` after the permanent redirect is active.
- Never add `/services-industries-preview.html` to the sitemap.
- Add a self-referencing canonical tag to the final `services.html`.
- During any temporary overlap, set `industries.html` canonical to `services.html` only when the combined page fully contains the approved Industries content.
- Verify production-domain absolute URLs when the final domain is confirmed.

## Permanent redirect considerations

- Use a true 301/308 platform redirect when possible, not a meta refresh.
- Preserve query strings so future quote/context parameters are not lost.
- Vercel can implement the redirect in `vercel.json` after the final hosting configuration is confirmed.
- Do not redirect before compatibility anchors and internal links are ready.
- Confirm that direct requests to `/industries.html`, trailing-slash variants, and case variants resolve predictably.
- Monitor 404s and old inbound links after launch.

Example future Vercel concept (documentation only):

```json
{
  "redirects": [
    {
      "source": "/industries.html",
      "destination": "/services.html",
      "permanent": true
    }
  ]
}
```

## Quote-prefill pattern

The canonical data model reserves these allow-listed parameters:

- `industry`
- `service`
- `need`
- `model`
- `source`

Foundation example:

```text
quote.html?industry=event&service=event&need=color-retention&model=cog&source=services-industries-preview
```

The existing quote form already recognizes current `industry` and `service` values. The `need`, `model`, and `source` parameters remain reserved until a separate approved quote-form enhancement. Do not add hidden CRM behavior during the combined-page launch without a documented data contract.

## Rollback

Until launch approval:

- Keep `services.html` and `industries.html` untouched.
- Keep the preview noindex and unlinked.
- Reverting the foundation requires removing only the preview page, preview CSS/JS, canonical data file, and these two documents.
- No redirect or public navigation rollback is required because none is implemented in this pass.
