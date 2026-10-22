# Exploratory Testing – PrestaShop Demo

- **Site:** https://demo.prestashop.com/
- **Environment:** Edge 155.0.4283.62, Windows, desktop viewport
- **Date:** 22.10.2026

## Finding 1 – Future birth date is rejected with a misleading "format" error

**Severity:** Medium

**Steps to reproduce**
1. Open https://demo.prestashop.com/#/en/front and wait for the shop to load.
2. Click "Sign in", then "Create your account".
3. Fill in a valid first name, last name, unique email and a strong password.
4. In "Birthdate" enter a future date: 11/11/2026.
5. Tick both required checkboxes and click "Create account".

**Expected result**
A future birth date is rejected with a message that explains the real problem
(the date cannot be in the future).

**Actual result**
The form is rejected with the message "Format should be 05/31/1970.", although the
entered value already has the correct format (MM/DD/YYYY). The password field is
also cleared after the error. A past date in the same format is accepted (tested
in the Bosnian locale: 2026-05-11), so the real cause is the future date, which the
message does not mention. In the Bosnian locale the field also shows a green
checkmark for the future date (2026-11-11) before submitting, which suggests the
client-side validation does not check the date.

**Evidence:** `docs/screenshots/finding-1.png` , `docs/screenshots/finding-4.png`

---

## Finding 2 – Incorrect and missing translations in the Bosnian locale

**Severity:** Low

**Steps to reproduce**
1. Open https://demo.prestashop.com/#/en/front and wait for the shop to load.
2. Change the language from "English" to "Bosanski" (top right).
3. Click "Prijavite se" and then the link to create an account.
4. Look at the "Datum rođanja" field label in the registration form.
5. Open the category "Umjetnost" (Art) from the main menu.

**Expected result**
All shop texts are translated into the selected language and spelled correctly
("Datum rođenja" for "Birthdate").

**Actual result**
- The birth date label in the registration form is misspelled as "Datum rođanja".
- The category description on the "Umjetnost" page stays in English: "Framed poster
  and vector images, all you need to give personality to your walls or bring your
  creative projects to life."

**Evidence:** `docs/screenshots/finding-2.png`, 
`docs/screenshots/finding-4.png`

---

## Finding 3 – Loading message says "a few seconds", but loading takes 10+ seconds

**Severity:** Low

**Steps to reproduce**
1. Open https://demo.prestashop.com/#/en/front.
2. Measure the time until the shop is visible. Repeat 3 times.

**Expected result**
The shop is available within "a few seconds", as the message states.

**Actual result**
The message "A shop is on its way and will take a few seconds to be available" is
shown for <7, 9, 11> seconds (measured 3 times).

**Evidence:** `docs/screenshots/finding-3.png`