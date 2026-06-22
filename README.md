# Sports Hall — Business Evaluation Dashboard

A single-page financial model for renting a sports hall (2 futsal courts + 5 pickleball
courts) that earns revenue purely from public hourly bookings. It models monthly
profit/loss and lets you stress-test the court utilization needed to break even.

This is a **modeling tool, not a booking system** — every number is an assumption you
control via inputs and sliders.

## How to run

Just open **`index.html`** in any modern browser (double-click it). No build step, no
server, no internet connection required — React, ReactDOM, and Babel are vendored
locally in `vendor/`.

> If your browser blocks the local scripts when opened via `file://`, serve the folder
> instead, e.g. `python -m http.server` then visit `http://localhost:8000`.

## What it does

- **Month/year picker** drives a real calendar-day count (actual weekdays vs weekend
  days for the selected month — not a 22/8 approximation).
- **Price grid:** 8 tax-inclusive RM/hour inputs (2 court types × weekday/weekend × day/night).
- **Utilization:** Simple (one global %) or Detailed (per day-type × time-band, with an
  optional Futsal-vs-Pickleball override per band). 0–100% is a labeled *theoretical
  ceiling*. Every cell shows its effective booked hours = courts × hours-in-period × util%.
- **Revenue:** auto-calculated court bookings + a free-form list of flat monthly items.
- **Expenses:** free-form Fixed list + Variable list (per-booking-hour rate, or %-of-revenue).
- **Profit panel:** Profit / Breakeven / Loss status, breakeven utilization %, breakeven
  revenue RM, and a near-capacity warning when breakeven needs ~100% of theoretical max.
- **Show your work:** every total is expandable into its literal line-by-line arithmetic,
  rendered directly from the same pure calculation functions that feed the headline numbers.
- **Booking Planner** (full-width section below the three columns): a clickable hourly grid
  per court for a representative weekday and weekend day (06:00–02:00). Paint when courts are
  typically booked and it shows that day's revenue, the monthly rollup (× actual weekday/weekend
  day counts), and the **implied utilization %** per band — a manual bridge you read off and type
  into the Utilization sliders. It is **standalone**: it reads only the price grid and calendar,
  and does *not* read from or write to the utilization sliders by default. Click an hour header to
  toggle a whole column; click a court label (F1, P3…) to toggle a row. An optional **"Apply implied
  utilization to the sliders"** button (with a confirm step) is the only write path: it switches
  Utilization to Detailed mode with per-court-type overrides set from the plan, which makes the main
  P&L's court revenue reconstruct the planner's monthly figure exactly.
- **Export (top-right):** **PDF** and **JPG** buttons capture the whole dashboard as it currently
  looks (html2canvas → image; PDF paginated across A4 via jsPDF). The export is WYSIWYG — whatever
  "show your work" sections you've expanded are included, so expand the breakdowns you want before
  exporting. The export buttons and the reset button are omitted from the captured image. If the
  export libraries don't load, the PDF button falls back to the browser's print-to-PDF dialog.
- **Persistence:** all inputs save automatically (Claude `window.storage` if available,
  otherwise `localStorage`). "Reset to defaults" restores the example model.

## Calculation engine

The math lives in pure, testable functions near the top of the `text/babel-src` block in
`index.html` (`getCalendarBreakdown`, `getCellHours`, `getCellBookedHours`,
`getCourtRevenue`, `getAdditionalRevenue`, `getFixedExpenses`, `getVariableExpenses`,
`getProfit`, `getBreakevenUtilization`, `getBreakevenRevenue`, plus the standalone Booking
Planner functions `getBookingDay` and `getBookingSummary`). A small `runSelfTests()`
sanity-checks them in the browser console on load.

## v1 non-goals

No seasonality, no no-show/cancellation modeling, no separate tax line (prices are
tax-inclusive), additional revenue is flat (not scaled by utilization), and the annual
figure is a simple ×12 of the selected month.
