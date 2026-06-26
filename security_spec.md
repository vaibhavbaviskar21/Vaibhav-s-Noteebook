# Security Specification: Vaibhav's Brain

## 1. Data Invariants and Relational Invariants

*   **Public Read-Only Boundary**: Non-authenticated visitors or non-admin accounts can only view sections, folders, settings, and posts that are explicitly labeled with `status == "published"`. Drafts and scheduled posts are forbidden.
*   **Sovereign Administrator Privilege**: Only the user authenticated with the Google email `bawiskarvaibhav@gmail.com` under `email_verified == true` can perform write operations (create, update, delete) on any document.
*   **Temporal and Identity Integrity**: Timestamps like `createdAt` and `updatedAt` must be set using Firestore's `request.time` during creation and modification.
*   **Id Character Restriction**: Path variables and identifiers must be safe strings (no malicious injections).

---

## 2. The "Dirty Dozen" Payloads (Adversarial Tests)

Here are the 12 malicious payloads meant to breach the system, which must all fail with `PERMISSION_DENIED`.

1.  **Unauthorized Section Creation**: A public user attempts to create a section `hack_section`.
2.  **Section Deletion by Anonymous**: An unauthenticated user tries to delete the root sections.
3.  **Spoofed Admin Post Creation**: A user with email `spoofer@gmail.com` attempts to write to `posts`.
4.  **Draft Reading Violation**: A public visitor tries to query posts with `status == "draft"`.
5.  **Scheduled Post Leak**: A public visitor tries to fetch a scheduled post direct document-get before its publish date.
6.  **Immutable Field Hijacking**: Admin or visitor attempts to rewrite the original `createdAt` of an existing post during update.
7.  **Unverified Email Escalation**: A user logging in with unverified email `bawiskarvaibhav@gmail.com` attempts a write.
8.  **Empty Title Corruption**: A write to `posts` is attempted with a missing required key `title`.
9.  **Status Value Poisoning**: An attempt to set `status` to `"secret_premium"` instead of standard enum.
10. **Folder Parent Poisoning**: An attempt to inject a 10MB string as the `parentFolderId` on folders.
11. **Linked Note Overflow**: Injecting a custom array of 1,000 dummy strings to crash client rendering of connected maps.
12. **Settings Manipulation**: Anonymous attempt to rewrite `settings/site` to inject spam links.

---

## 3. Test Cases Spec Sheet (firestore.rules)

Our rules security checks:
- `match /{document=**}`: Default deny.
- `match /sections/{sectionId}`: Written by admin `bawiskarvaibhav@gmail.com`, read by anyone.
- `match /folders/{folderId}`: Written by admin `bawiskarvaibhav@gmail.com`, read by anyone.
- `match /posts/{postId}`: Written by admin `bawiskarvaibhav@gmail.com`. Read by anyone ONLY if status is `"published"`.
- `match /settings/{settingId}`: Written by admin `bawiskarvaibhav@gmail.com`, read by anyone.
