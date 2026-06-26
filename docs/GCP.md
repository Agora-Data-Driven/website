# GCP Estate Guide — Agora Data Driven

> **Audience:** Claude / any AI agent (and humans) operating on Agora's Google Cloud.
> **Purpose:** Understand the structure *before* touching anything, and follow the safety rules.
> **Last verified:** 2026-06-26 (account `info@agoradatadriven.com`). Re-verify live before destructive actions — cloud state drifts.

---

## 0. Read this first (orientation)

| You want to… | Go to |
|---|---|
| The marketing **website**, **Skill Mastery**, **Atrium** | project `agora-data-driven` (Cloud Run) |
| **Gemini / AI Studio API keys** | project `gen-lang-client-0941855890` ("AG Key") |
| Client analytics data (Shopify/sales) | `contract-shop`, `honey-tribe`, `spotless-water-system`, `rooming-house-experts` → all in the **`Archive-Stale`** folder |
| Server-side GTM container | `gtm-n65rwhzw-nmuwm` → in **`Archive-Stale`** |
| Apps Script automations (ad scripts, reporting) | the **second org** `1075941031589` — see §8 |

**The single most important fact:** there are **TWO organizations**, and `info@agoradatadriven.com` only controls one of them. See §2.

---

## 1. Golden rules for AI agents

1. **Always pass `--project=<ID>` explicitly.** Never rely on or change the active config in automated/parallel work. **Never run `gcloud config set project`** in a script that other calls depend on — it's global mutable state and races.
2. **Add `-q` and `</dev/null`** to non-interactive gcloud calls so they can't hang on a prompt (e.g. "enable this API? [y/N]"). Wrap slow calls in `timeout 30`.
3. **`bq` is slow and re-auths each call** — guard it with `timeout` and expect "API not enabled" noise on projects without BigQuery.
4. **Archive, don't delete, anything holding real data, API keys, OAuth clients, or a running service.** Deletion is a last resort. "Archive" = move into the `Archive-Stale` folder (org `758` only).
5. **Deletion is soft for 30 days.** `gcloud projects delete` → state `DELETE_REQUESTED`; recover with `gcloud projects undelete <ID>`. After ~30 days it's permanent.
6. **Confirm the active account first:** `gcloud config get-value account` should be `info@agoradatadriven.com` for org-758 work.
7. **Apps Script `sys-*` projects back live Google Apps Script automations.** Deleting one can break a running script. Treat as off-limits unless proven dead.

---

## 2. Accounts & Organizations (the two-org reality)

| Org ID | Domain | Our access | Notes |
|---|---|---|---|
| **`758813992383`** | **agoradatadriven.com** | `info@agoradatadriven.com` = **Owner + Org Admin** (full control) | The real business org. Everything we manage lives here. |
| **`1075941031589`** | *separate* (likely a personal / 100.digital Workspace) | **view-only / inherited** — `info@` **cannot** delete or move anything here (verified, permission denied) | Holds ~24 misc projects **and all ~41 Apps Script `sys-*` projects**. To manage it: sign in as `ian@100.digital` (its likely admin) or have that org's owner grant `info@` rights. |

**Authenticated accounts in this machine's gcloud:**
- `info@agoradatadriven.com` ← **active**, use this for org-758 work.
- `ian@100.digital` ← present but **credentials expired**; needs `gcloud auth login ian@100.digital` to use.

**Billing:** one account `0173D5-121AA7-99E687` ("My Billing Account"). Only **5 projects** are billing-enabled: `agora-data-driven`, `gen-lang-client-0941855890`, `gtm-n65rwhzw-nmuwm`, `contract-shop`, `honey-tribe`. Every other project is free-tier only (so they can't run Compute/Cloud Run/SQL — only Apps Script links, Gemini keys, BigQuery sandbox, etc.). Archiving a project does **not** change its billing.

---

## 3. Org `758813992383` (agoradatadriven.com) structure

```
agoradatadriven.com  (org 758813992383)
│
├─ agora-data-driven        ← ACTIVE. Website + Skill Mastery + Atrium. (kept at root)
├─ gen-lang-client-0941855890 "AG Key"  ← ACTIVE. All Gemini API keys. (kept at root)
│
├─ 📁 Archive-Stale  (folder 605415422721)   ← parked-but-preserved; not deleted
│    ├─ contract-shop          (Shopify/sales BigQuery — client "TCS")
│    ├─ honey-tribe            (sales BigQuery — client)
│    ├─ spotless-water-system  (BigQuery + GCS + App Engine — client)
│    ├─ rooming-house-experts  (BigQuery marketing_data — client)
│    ├─ gtm-n65rwhzw-nmuwm     (LIVE server-side GTM container; still billable)
│    ├─ serious-unison-493504-j4 ("n8n google credentials" — OAuth client for n8n)
│    ├─ gen-lang-client-0364679287 (held a Gemini key)
│    ├─ test-project-472906    (had a BQ dataset "DB_1")
│    ├─ brett-email-extractor-api (empty but named)
│    └─ isca-470313            (empty but named — client "ISCA")
│
└─ 📁 system-gsuite  (846640445498)   ← Google Workspace-managed; leave alone
```

> ⚠️ **Console gotcha:** the project-picker's **"Recent"** tab shows a *flat* list and **ignores folders** — archived projects still appear there. To see the real tree, use the **"All"** tab or the [Manage Resources page](https://console.cloud.google.com/cloud-resource-manager?organizationId=758813992383).

---

## 4. The flagship project: `agora-data-driven`

This one project hosts all three active products plus the central data warehouse. **Do not move or delete it.**

**Cloud Run services** (verified 2026-06-26):

| Service | Region | What it is |
|---|---|---|
| `agora-data-driven` | `australia-southeast1` | The marketing **website** (Astro SSR) |
| `agora-data-driven` | `asia-southeast1` | **Duplicate** website deployment in a 2nd region — *candidate for consolidation* |
| `mastery-engine` | `us-central1` | **Skill Mastery** |
| `platform-dash` | `asia-southeast1` | **Atrium** (internal platform/dashboard) |

**Other resources in this project:**
- **Firestore:** one Native DB (`(default)`, `us-central1`).
- **BigQuery (~18 datasets):** the data warehouse — e.g. `mastery_analytics`, `upwork`, `jeff_nippard`, `popflex`, `iron_neck`, `edge_lifestyle`, `rooming_house_experts`, `RHE`, `wildapricot`, plus `clothing_store_*`, `ecom_*`, `sales_data_synthetic`, `DB_1`, `Classroom`.
- **Secrets (Secret Manager):** `GEMINI_API_KEY`, `APP_PASSWORD`, `SESSION_SECRET`, `platform-dash-session-key`, `platform-sso-key`, `platform-super-admin-password`.
- **Cloud Storage:** `agora-data-driven-platform-dash`, `agora-riverdance-report`, `*_cloudbuild`, `run-sources-*`.
- **Artifact Registry (Docker):** `agora`, `cloud-run-source-deploy`.
- **Service accounts:** `platform-dash-web@…`, the default compute SA.

**Website deploy** (from the website repo): `npm run deploy` → builds remotely via **Cloud Build** → pushes image to **Artifact Registry** → deploys to **Cloud Run**. gcloud project `agora-data-driven`. (See repo `CLAUDE.md` / `README.md`.)

---

## 5. The keys project: `gen-lang-client-0941855890` ("AG Key")

Auto-created by Google AI Studio; **holds 8 live Gemini API keys** used across automations/apps: `Skill Mastery`, `Quiz`, `Bidbrain`, `Antigravity API`, `Voice First AI Innovation Challenge`, `Bhutan Assistant`, and two `Gemini API Key`. **Deleting this project revokes all of them** — keep it.

---

## 6. The `Archive-Stale` folder (605415422721)

A holding area created during the 2026-06-26 cleanup for projects that aren't part of the 3 active products but **hold real data, keys, OAuth clients, or a running service**. Policy:
- Projects here are **fully intact** — nothing was deleted or stopped. (`gtm-n65rwhzw` sGTM still runs and still bills.)
- It exists to keep the org root uncluttered (root = just the 2 active products).
- **Before** deleting anything from here, confirm with a human — these touch clients (Honey Tribe, Contract Shop / TCS, ISCA, Spotless Water, Rooming House Experts) or integrations (n8n).

To move a project **into** the archive:
```bash
gcloud beta projects move <PROJECT_ID> --folder=605415422721 -q
```
(Note: `gcloud projects move` is **not** GA — use `gcloud beta projects move`.)

---

## 7. Permissions — what `info@` can do

`info@agoradatadriven.com` on org `758813992383` holds: `roles/owner`, `roles/resourcemanager.organizationAdmin`, `roles/resourcemanager.folderAdmin`, `roles/resourcemanager.projectDeleter`, `roles/orgpolicy.policyAdmin`.

> History: `info@` originally had only Organization Admin, which **manages IAM but cannot create folders or delete projects**. On 2026-06-26 it self-granted `owner` (+ folderAdmin/projectDeleter) to perform the cleanup. If you want least-privilege, you can drop back to just Organization Admin — but `owner` is reasonable for the org owner's primary account.

On org `1075941031589`: **no write access.** Don't attempt deletes/moves there as `info@` — they fail with `PERMISSION_DENIED`.

---

## 8. The second org `1075941031589` (NOT yet cleaned)

`info@` can list but not modify these. Contents:
- **~24 misc projects:** mostly auto-created Gemini key projects (`gen-lang-client-*`), plus `N8N Project` (`dynamic-chiller-461017-k3`), Google `Merchant Center`, `Dashboard`, `Cascade CRM`, `WRK Ops Brain GPT`, `Workspace CLI`, `Email Automation`, sandboxes (`voltaic-sandbox`, `solid-idiom`, etc.). Several hold **live API keys** (Replit, Creative Production, "Default Gemini") and service accounts.
- **~41 Apps Script `sys-*` projects** in two managed folders (`442127466759`, `957128588745`): e.g. `Auto Negative Keywords`, `Northbeam Microsoft Ads Daily`, `Multi-Brand Report Card Dashboard`, `WebSavvy MCC pMax charts`, `TCS Contents`, `Sabbath Automation`, `Account Summary`. These back **live Google Ads / reporting automations** — assume in-use.

**To manage it:**
```bash
gcloud auth login ian@100.digital            # if that account admins org 1075
# or, from an org-1075 owner:
gcloud organizations add-iam-policy-binding 1075941031589 \
  --member="user:info@agoradatadriven.com" --role="roles/owner"
```
Then apply the same **archive-don't-delete** discipline.

---

## 9. Apps Script (`sys-*`) projects — what they are

When you bind a Google Apps Script to a standard GCP project (for OAuth scopes / advanced services), Google creates a project with a `sys-XXXXXXXX…` ID, parented under a `system-gsuite`-type folder. The **code lives in Google Drive, not GCP.** Deleting the `sys-` project can break the script's OAuth/advanced-service access. All of Agora's `sys-*` projects currently live in **org 1075** (which we can't touch anyway).

---

## 10. Common operations cookbook

```bash
# Confirm who/where you are
gcloud config get-value account
gcloud config get-value project

# See the real org tree (not the flat "Recent" list)
gcloud projects list --filter="parent.id=758813992383 AND lifecycleState=ACTIVE"      # root
gcloud projects list --filter="parent.id=605415422721"                                # Archive-Stale
gcloud resource-manager folders list --organization=758813992383

# Inventory a project's resources (read-only)
gcloud services list --enabled --project=<ID>
gcloud run services list --project=<ID>
gcloud services api-keys list --project=<ID>            # add -q </dev/null
bq ls --project_id=<ID>                                 # wrap in: timeout 30 … 2>/dev/null
gcloud storage buckets list --project=<ID>

# Which projects can incur cost
gcloud billing projects list --billing-account=0173D5-121AA7-99E687

# Lifecycle
gcloud beta projects move <ID> --folder=605415422721 -q   # archive
gcloud projects delete <ID> -q                            # soft-delete (30-day recovery)
gcloud projects undelete <ID>                             # restore within 30 days
gcloud projects list --filter="lifecycleState=DELETE_REQUESTED"   # pending purge
```

---

## 11. Change log

- **2026-06-26** — Full audit + cleanup of org `758813992383`. Created `Archive-Stale` folder; moved 10 projects into it; **soft-deleted 6 empty junk projects** (`agora-data-drive-1776657705620` [duplicate], `gentle-app-465622-k3`, and empty no-key Gemini projects `…0427829530`, `…0488824698`, `…0283206760`, `…0270906471`). Org root reduced from ~18 projects to the 2 active products. Org `1075941031589` left untouched (no access).

## 12. Known follow-ups / open questions

- [ ] **Website deployed in 2 regions** (`asia-southeast1` + `australia-southeast1`) — intentional, or consolidate to one to cut cost?
- [ ] **Second org `1075941031589`** still needs cleanup — requires `ian@100.digital` re-auth or an IAM grant.
- [ ] Decide whether to **bulk-delete** the `Archive-Stale` contents once confirmed unused (esp. dormant clients).
- [ ] Decide whether to keep `roles/owner` on `info@` or revert to Organization Admin.
- [ ] The 6 soft-deleted projects purge permanently ~2026-07-26 unless undeleted.
