# Tohfa: premium gift shop (Next.js)

Next.js 15 App Router, JavaScript/JSX, Tailwind CSS 3, Framer Motion, React Icons, MongoDB (Mongoose), Nodemailer, Cloudinary.
Guest checkout for customers. Admin panel with its own login. No TypeScript.

## Run locally

```bash
npm install
cp .env.example .env.local     # then fill it in (see below)
npm run dev                    # http://localhost:3000
```

The storefront works immediately without any env vars: products come from `src/data/products.js`.
Orders, the contact form and the admin panel need MongoDB (see "Connect MongoDB").

Placeholder illustrations are in `public/images`. Regenerate them any time with `npm run placeholders`.

## Where things live

| You want to change              | Edit this                                      |
| ------------------------------- | ---------------------------------------------- |
| Brand, phone, WhatsApp, address, hours, shipping, SEO, footer, nav | `src/data/siteConfig.js` |
| Home page copy                  | `src/data/homeContent.js`                      |
| About / Contact copy            | `src/data/pageContent.js`                      |
| Categories, price ranges, sort  | `src/data/categories.js`                       |
| Occasions                       | `src/data/occasions.js`                        |
| Products (without a database)   | `src/data/products.js`                         |
| Customer reviews                | `src/data/reviews.js`                          |
| Privacy / Terms / Shipping text | `src/data/policies.js` (have these reviewed for your business) |
| Colours, spacing, motion timing | `:root` in `src/app/globals.css`               |
| Fonts                           | `src/lib/fonts.js`                             |
| Every image path                | `src/data/images.js`                           |

Everything marked `REPLACE` in `siteConfig.js` is a placeholder (phone, WhatsApp, email, address, Maps link, social links).

## Add or change products

- **With MongoDB (recommended):** sign in at `/admin`, Products > Add product. First time, open Settings > "Import starter products" to copy the sample catalogue into your database.
- **Without MongoDB:** edit `src/data/products.js` and redeploy. Each product needs a unique `slug` (it becomes `/product/<slug>`).
- Product pages refresh within about a minute of an admin edit.

## Email notifications (Nodemailer)

Fill the `SMTP_*`, `MAIL_FROM` and `ADMIN_NOTIFY_EMAIL` values in `.env.local`. Then:

- Every **order**, **contact inquiry** and **customer problem report** is emailed to `ADMIN_NOTIFY_EMAIL` (reply-to is the customer, and there's a "Reply on WhatsApp" button).
- **Visitors are never emailed.** Only you receive alerts (customers' email addresses are optional and only shown to you).
- If MongoDB is not connected, the email is your only copy and says so at the top.
- Email problems never block an order: failures are logged, and the customer sees a WhatsApp fallback if neither the database nor email received it.
- In `/admin/settings` press **Send a test email** to check your credentials.

Gmail: turn on 2-Step Verification, create an **App password**, use it as `SMTP_PASS` with host `smtp.gmail.com`, port `465`, `SMTP_SECURE=true`.

## Photo uploads (Cloudinary)

Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. In the product form you can upload (several at once), replace, reorder and remove photos.

- Uploads go to the `tohfa/products` folder, resized to at most 1600x2000 and auto-compressed. Max 4 MB each (Vercel's request limit).
- **Replacing or removing a saved photo deletes the old one from Cloudinary when you press Save.** Deleting a product deletes its photos too.
- A photo you upload and then remove before saving (or cancel the form) is deleted immediately.
- The code only ever deletes images inside your own `tohfa/products` folder, and never one that another product still uses. Local `/images/...` files are never touched.
- If you close the browser tab mid-edit, uploaded-but-unsaved photos can be left behind. Clean them from the Cloudinary dashboard.

## Customer data and the DPDP Act, 2023

Checkout, the contact form and the problem form all show a plain-language notice (what we collect, why, who sees it, how long we keep it, how to use their rights) and need **two separate, un-ticked checkboxes**: 18+ and consent to the use described. The server rejects any request without both, and each order, inquiry and problem report stores the consent time and notice version.

- Edit the notice, retention periods and grievance officer in `src/data/privacyNotice.js`. Change `NOTICE_VERSION` whenever the meaning changes.
- The full privacy policy (`/privacy-policy`, with a `#your-rights` section) is generated from the same file.
- Honouring an erasure request: in `/admin/inquiries` and `/admin/users-problems` use **Delete**. Orders are kept for tax records (see `retention`).
- This is a good-faith starting point, not legal advice. Have your CA or a lawyer review it before launch.

## Home page: shop photo section and pop-up

- **Shop photo section** (right after the hero): the words live in `src/data/homeContent.js` under `shop`. Put your photo in `public/images/shop/` (landscape, 1600px wide or more) and change `shopImage` in `src/data/images.js`. The address, hours, "Get directions" and "Call" buttons come from `siteConfig.js`.
- **Inquiry pop-up**: opens 5 seconds after a visitor lands on the home page; its close (cross) button appears 2 seconds after it opens, and Esc / clicking outside are also blocked until then. Change `OPEN_AFTER` and `CLOSE_AFTER` at the top of `src/components/home/InquiryPopup.jsx`. It shows once per visit (and not again for 7 days after someone submits). It has the same DPDP notice and consent boxes as the contact form, and emails arrive marked "Home page pop-up".

## Hinglish copy

Short Hinglish lines sit next to the English ones (announcement bar, shop intro, contact, checkout, empty cart, 404, footer, consent notice). Edit or blank any of them in `src/data/hinglish.js`.

## Add your logo and real photos

- **Logo:** put `logo.png` or `logo.svg` in `public/images/branding/`, then set `logo.image` in `siteConfig.js` (for example `"/images/branding/logo.png"`). Replace `src/app/icon.svg` for the favicon.
- **Product photos:** save as `public/images/products/<slug>-1.jpg`, `<slug>-2.jpg`. Category photos: `public/images/categories/<category-slug>.jpg`. Then change `IMAGE_EXT` to `"jpg"` in `src/data/images.js`.
- Products added in the admin can point at any path or a full `https://` URL. Allow the host in `next.config.mjs` (`images.remotePatterns`) if it isn't Cloudinary or Unsplash.
- For social sharing, a PNG/JPG product image is used automatically. Otherwise the generated site card (`src/app/opengraph-image.jsx`) is shown.

## Connect MongoDB

1. Create a free cluster on MongoDB Atlas. Database Access: create a user. Network Access: allow your IP (and `0.0.0.0/0` for Vercel, or use Vercel's integration).
2. Copy the connection string into `.env.local` as `MONGODB_URI` (add a database name, e.g. `...mongodb.net/tohfa?retryWrites=true&w=majority`).
3. Restart `npm run dev`.

Collections are created automatically: `admins`, `products`, `orders`, `inquiries`, `supporttickets`.

## Admin authentication

1. In `.env.local` set `AUTH_SECRET` (`openssl rand -base64 48`) and `ADMIN_SIGNUP_CODE` (any long secret only you know).
2. Visit `/admin/signup`, enter your name, email, a password (10+ characters) and the signup code.
3. After creating your account(s), delete `ADMIN_SIGNUP_CODE` from your environment to switch signup off.

How it's built: passwords are hashed with bcrypt (cost 12) and never stored or logged in plain text. Sessions are signed JWTs in an httpOnly, SameSite=Lax cookie (Secure in production). `src/middleware.js` blocks every `/admin/*` and `/api/admin/*` route without a valid session, and each admin API handler checks again (`withAdmin`) plus an Origin check. Login and signup are rate-limited.

## How ordering works

There is **no online payment gateway**. Checkout is an order request: the server re-prices every line from your product data (the browser's prices are ignored), checks stock, saves the order to MongoDB and reserves stock. You then confirm on WhatsApp and collect payment on delivery or via a UPI link. If MongoDB isn't connected, the success page gives the customer a pre-filled WhatsApp message so no order is lost. Cancelling an order in the admin returns its stock.

To add a real gateway later (Razorpay / Cashfree): create the gateway order inside `createOrder()` in `src/lib/orders.js` and add a webhook route that marks the order "confirmed".

## Deploy to Vercel

1. Push this folder to GitHub and import it in Vercel (framework: Next.js, no extra settings).
2. Add every variable from `.env.example` (site URL, MongoDB, auth, SMTP, Cloudinary).
3. Deploy, then visit `/admin/signup`, create your account and import the starter products from Settings.
4. Submit `https://your-domain/sitemap.xml` in Google Search Console.

## Known limits

- The in-memory rate limiter is per server instance. For strict limits on Vercel, swap `src/lib/rateLimit.js` for Upstash Redis.
- Admin sessions last 7 days and can't be revoked individually (change `AUTH_SECRET` to sign everyone out).
- Reviews are static (`src/data/reviews.js`); there's no customer review submission.
