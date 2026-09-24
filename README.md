# Sharaly Restaurant Customer+ Website

This package keeps the existing Sharaly visual direction and logo, and adds a customer-first ordering layer with features beyond a basic GloriaFood-style menu.

## Included customer features
- Smart food search
- Vegetarian / Popular / Offers filters
- Favourite dishes
- Loyalty points and reward redemption
- Coupon code demo
- Live order status UI
- Scheduled order UI
- One-tap reorder demo
- Delivery fee estimator
- Customer reviews and ratings
- QR table ordering demo
- Table reservation demo
- Cash / card / online payment selection UI
- Delivery zone checker
- Multi-location branch selector
- Staff & kitchen workflow panel
- Receipt / invoice print preview
- Responsive mobile layout
- Existing Sharaly digital menu, smart orders, kitchen flow and business insights
- Existing Sharaly restaurant login demo

## Files
- index.html — main website
- style.css — existing Sharaly styling
- customer-plus.css — new customer UI styling
- script.js — existing menu/order/kitchen/insight logic
- customer-plus.js — new customer features
- login.html / login.css / login.js — login demo
- images/sharaly-logo.png — Sharaly logo

## Important
This is a front-end demo. Orders, favourites, points, reviews and reservation demos use browser localStorage where applicable. For a real restaurant deployment, connect PHP/MySQL (or another backend) for authentication, persistent orders, payment gateway, delivery management, admin controls and real-time kitchen updates.

Food images currently use web image URLs; replace them with licensed/local restaurant images before production.


## Restaurant Pro+ additions
These front-end demos are designed to make Sharaly feature-complete for a project presentation. QR generation uses the QRServer image endpoint; replace it with a self-hosted QR library for an offline/production build. Payment buttons, reservations, delivery zones and multi-location selection are UI demos until connected to a backend/payment provider.
