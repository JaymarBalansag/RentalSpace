# Owner Verification Backend Guide

This frontend expects manual owner verification handled by admin, with separate owner payment and verification states.

## 1. Database (SQL)

```sql
ALTER TABLE users
ADD COLUMN owner_verification_status ENUM('unverified','pending','verified','rejected') NOT NULL DEFAULT 'unverified',
ADD COLUMN owner_verified_at TIMESTAMP NULL,
ADD COLUMN owner_verification_rejected_reason TEXT NULL;

ALTER TABLE users
ADD COLUMN business_permit_path VARCHAR(255) NULL,
ADD COLUMN valid_id_path VARCHAR(255) NULL;

CREATE INDEX idx_users_owner_verification_status ON users(owner_verification_status);
```

## 2. Payment Flow Update

When payment is successful and user becomes owner:

```sql
UPDATE users
SET role = 'owner',
    owner_verification_status = CASE
      WHEN owner_verification_status = 'verified' THEN 'verified'
      ELSE 'pending'
    END
WHERE id = ?;
```

Notes:
- Keep `verified` as-is if already verified.
- Do not auto-verify after payment.

## 3. Owner Subscription Status Endpoint

Endpoint: `GET /owner/subscription-status`

Return current fields plus:

```json
{
  "data": {
    "can_manage_properties": true,
    "owner_verification_status": "pending",
    "owner_verified_at": null
  }
}
```

`can_manage_properties` should still be based on subscription/payment rules, not verification.

## 4. Property Data Endpoints

Include owner verification status in property responses:

```sql
SELECT
  p.*,
  u.first_name,
  u.last_name,
  u.owner_verification_status
FROM properties p
JOIN users u ON u.id = p.owner_id
WHERE p.id = ?;
```

Use aliases as needed (e.g. `owner_verification_status`).

## 5. Admin Owner List Endpoint

Endpoint: `GET /admin/owner`

Recommended query:

```sql
SELECT
  id,
  first_name,
  last_name,
  email,
  created_at,
  owner_verification_status AS verification_status
FROM users
WHERE role = 'owner'
ORDER BY created_at DESC;
```

## 6. Admin Owner Detail Endpoint

Endpoint: `GET /admin/owner/{ownerId}`

```sql
SELECT
  id,
  first_name,
  last_name,
  email,
  owner_verification_status AS verification_status,
  owner_verified_at,
  owner_verification_rejected_reason,
  business_permit_path,
  valid_id_path
FROM users
WHERE id = ? AND role = 'owner'
LIMIT 1;
```

Return public URLs for documents:
- `business_permit_url`
- `valid_id_url`

## 7. Admin Verify/Reject Endpoint

Endpoint: `PATCH /admin/owner/{ownerId}/verification`

Input:

```json
{
  "verification_status": "verified",
  "reason": ""
}
```

Controller behavior:
- If `verified`: set `owner_verification_status='verified'`, set `owner_verified_at=NOW()`, clear rejected reason.
- If `rejected`: set `owner_verification_status='rejected'`, set rejected reason, set `owner_verified_at=NULL`.
- Optional support for `pending`/`unverified`.

SQL examples:

```sql
UPDATE users
SET owner_verification_status = 'verified',
    owner_verified_at = NOW(),
    owner_verification_rejected_reason = NULL
WHERE id = ? AND role = 'owner';
```

```sql
UPDATE users
SET owner_verification_status = 'rejected',
    owner_verified_at = NULL,
    owner_verification_rejected_reason = ?
WHERE id = ? AND role = 'owner';
```

## 8. `/user` Profile Payload

Ensure `/user` includes:
- `owner_verification_status`
- `owner_verified_at`

Frontend now hydrates these into Pinia/localStorage.
