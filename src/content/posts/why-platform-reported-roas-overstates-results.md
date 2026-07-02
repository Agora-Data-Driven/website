---
title: 'Why Platform ROAS Overstates Results & Real Revenue'
publishDate: 2026-06-27
excerpt: 'Platform-reported ROAS often overstates ad performance because each platform takes credit for the same sales, distorting budget decisions.'
heroImage: '/placeholders/cover-2.svg'
heroAlt: 'Platform-reported ad revenue compared against real booked revenue.'
category: 'Marketing Analytics'
industry: 'E-commerce'
draft: false
---

Add up the revenue each of your ad platforms claims to have generated. Now compare that total to the actual revenue in your accounting system. For any advertiser running more than one channel, a common discrepancy emerges: the platforms' combined number is larger, sometimes dramatically larger, than the money the business actually made.

That isn't fraud. It's the predictable result of how return on ad spend (ROAS) is calculated and who is doing the calculating. Each platform is grading its own homework, and they're all claiming credit for the same sales.

For one Agora client, this overstatement had quietly distorted years of budget decisions. We rebuilt their measurement and [attribution setup](/attribution-models-compared-spend-to-revenue/) so that paid-media spend could be tied back to actual revenue instead of platform-reported conversions. That didn't conjure new sales. It showed which spend was actually producing revenue the business could bank, and which had been coasting on credit it didn't earn.

Here's why platform ROAS overstates results, and what to measure instead.

## ROAS Is a Ratio, and Both Halves Are Suspect

ROAS is simple on the surface: revenue attributed to ads, divided by ad spend. The denominator is at least knowable, though "spend" is rarely as clean as it sounds, you have to decide whether it means media spend alone or also includes agency fees, creative production, and software. For an apples-to-apples ratio, hold it to media spend and keep it consistent. The bigger problem lives in the numerator: _attributed revenue_. Every platform decides for itself which sales to count, and they all use generous rules.

There are three structural reasons the number inflates:

- **Self-attribution.** Meta decides which conversions Meta caused. Google decides which conversions Google caused. Neither knows, or has any incentive to know, what the other did. A single purchase a customer made after seeing a Facebook ad _and_ clicking a Google ad gets counted fully by both.
- **Generous attribution windows.** Platforms credit themselves for conversions that happen days or even weeks after an ad interaction, including view-throughs where the user never clicked. A purchase that would have happened anyway can land inside that window and get claimed.
- **Modeled and estimated conversions.** With tracking signal eroding, platforms increasingly _model_ conversions they can't directly observe, statistically filling in gaps. That can be reasonable, but it means a portion of "your" reported revenue is an estimate the platform is motivated to keep optimistic.

Stack these together and you get a numerator that's been padded from three directions at once.

## The Double-Counting Problem, Made Concrete

Imagine a customer's real journey: they see your brand in an Instagram ad, ignore it, search your brand name on Google a week later, click a Search ad, and buy.

- Meta counts that sale, its ad created the awareness, and the purchase fell inside its view-through window.
- Google counts that same sale, its ad got the final click.

One order. Two platforms each reporting full revenue. If you trust both dashboards, you believe you earned twice what you actually did, and you'll happily increase both budgets chasing a return that doesn't exist at the blended level.

Now multiply that across thousands of orders and several channels. The overlap is exactly where money gets wasted, because it's the spend each platform is most eager to take credit for, and therefore the spend you're most likely to scale on bad information.

## Platform ROAS vs. Real Revenue: What Each Actually Tells You

| **Question**                         | **Platform ROAS answers**       | **Real revenue measurement answers**               |
| :----------------------------------- | :------------------------------ | :------------------------------------------------- |
| Who gets the credit?                 | This platform, by its own rules | The business, across all channels                  |
| Is double-counting possible?         | Yes, freely                     | No, reconciled to one source of truth              |
| Does it include modeled conversions? | Often, undisclosed              | Only confirmed orders                              |
| Can it guide budget shifts?          | Per-platform optimization only  | Yes, where incremental revenue actually comes from |
| Whose interest does it serve?        | The platform's                  | Yours                                              |

Platform ROAS is not useless. It's a fine signal for optimizing _within_ a platform, comparing two Meta campaigns against each other, where the self-attribution bias is roughly constant. It becomes dangerous the moment you use it to compare _across_ platforms or to judge whether your total marketing investment is paying off.

## The Number That Actually Matters: Incrementality

The honest question isn't "how much revenue does the platform claim?" It's "how much revenue would I lose if I turned this spend off?" That's incrementality, and it's almost always lower than reported ROAS, because some of the credited sales would have happened anyway.

You don't need a perfect lab experiment to start moving in this direction. Three approaches, in increasing rigor:

1.  **Reconcile to one source of truth.** Pick the system that holds real money, your store backend or accounting platform, and make total marketing-attributed revenue add up to what actually landed there. No channel gets to report revenue the business didn't book.
2.  **Compare to a blended baseline.** Track total revenue against total marketing spend over time. When you change a channel's budget, watch what the _blended_ number does, not what the platform claims for itself.
3.  **Run holdout or geo tests.** Deliberately withhold a channel from a region or audience and measure the difference against a comparable group that still gets it. The revenue gap between them is the channel's real contribution.

## How the Rebuild Worked

For the Agora client, this was a measurement and attribution rebuild, not a reporting tweak. We made the backend order record the single source of truth, the confirmed, booked orders the business actually fulfilled and got paid for. We changed [how order data was collected](/server-side-vs-client-side-tracking-ga4/) so each platform was matched against those confirmed order values rather than its own pixel-fired events. Then we reconciled the two: for a given period, the revenue the platforms collectively claimed was checked line by line against the revenue the books recorded, and the difference was attributed back to overlap and modeling rather than left to inflate each channel's dashboard.

With that in place, budgets stopped being judged by the numbers each channel reports about itself and started being judged against revenue the business could verify in its own books. That shifted spend toward channels producing incremental sales and away from ones that had been double-counting their way to a flattering dashboard.

## What to Do This Week

You can start validating your own numbers this week with three steps:

- **Run the sum test.** Add up the revenue every ad platform claims for the last 90 days. Compare it to your actual revenue for the same period. The gap is your overstatement, in dollars.
- **Pick your source of truth.** Decide, before you're mid-argument about a budget, which system defines a "real" sale. It should be the one that holds the money.
- **Stop comparing platforms by their own ROAS.** Use platform numbers to optimize inside each channel, and use blended revenue-to-media-spend to decide how much each channel deserves.

This isn't about fraud; it's about a conflict of interest. Each platform's measurement system is built to maximize its own perceived value, not to give you a clear picture of your overall business. The fix is to stop making million-dollar budget decisions with a number that was never designed to answer the question you're asking it.
