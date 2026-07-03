---
title: "MoviePass Had 3 Million Subscribers and Still Didn't Know What They Cost"
publishDate: 2026-06-24
excerpt: "MoviePass built its pricing model on an assumption about user behaviour that it never tested. The assumption was wrong, and the company burned through tens of millions of dollars per month before that became undeniable."
category: "Marketing Analytics"
type: case-study
draft: false
industry: "SaaS"
---

In August 2017, MoviePass dropped its price from $29.95 to $9.95 per month for unlimited cinema visits. Within weeks, subscriptions jumped from 20,000 to over 400,000. By the end of 2017, the service had passed 3 million subscribers.

The problem was that MoviePass was losing money on every active user. Not a little money, they were paying cinemas full ticket price (typically $10-15 per ticket) for every film their subscribers saw, and collecting $9.95 per month per subscriber. A subscriber who saw one film a month in most US markets meant MoviePass lost money immediately. A subscriber who saw two films in a month meant a significant loss.

None of this was a surprise in retrospect. What is interesting is that it was avoidable with a modest amount of pre-launch data work.

## The Model They Chose and Why It Failed

The pricing model MoviePass chose was borrowed from the gym membership model. The economics of gym memberships work because there is a large gap between the number of members who sign up and the number who actually use the gym regularly. A well-run gym might have four or five times as many members as it can physically accommodate, because most members pay without showing up.

MoviePass's leadership stated publicly that they expected similar dynamics. The assumption was that a significant portion of subscribers would pay $9.95 but attend the cinema infrequently, the cinephile equivalent of the gym member who never goes after January.

This assumption was wrong in a structurally important way. Gyms attract a broad population that includes people who want the optionality of going but usually do not. Cinema subscriptions at $9.95/month for unlimited films were only attractive to people who already went to the cinema frequently, because anyone who only goes to the cinema twice a year already had a more economical relationship with the medium. The pricing selected against low-frequency users rather than attracting them.

## What a Pre-Launch Data Model Should Have Caught

There is a relatively simple analysis that MoviePass could have run before launching at $9.95:

**Step one**: survey or research the cinema-going frequency distribution of the US population. This data exists, research firms track it, and Helios and Matheson Analytics (MoviePass's parent company after 2017) was a data analytics business. The distribution is not flat. A small share of the population goes to the cinema frequently; most go rarely or not at all.

**Step two**: model who would actually subscribe at different price points. At $9.95/month, the only rational subscriber is someone who already goes to the cinema more than once a month at regular prices. Anyone who goes less frequently would overpay for the subscription relative to paying per ticket.

**Step three**: estimate the average cinema visits per month for that subscriber group. If the target market is heavy cinema users, the expected usage rate is not the population average, it is the heavy-user average, which could be three or four visits per month.

**Step four**: price to that usage rate, not the population average, or find cinema chains willing to accept a per-subscriber fee rather than a per-visit fee.

None of this analysis requires a data science team. It requires an honest model of who subscribes and why.

## The Actual Numbers

MoviePass was burning approximately $40 million per month at peak. They introduced restrictions over time, blocking certain films, limiting visits, partly because the usage data, which they collected after launch, confirmed the problem they had not modelled before launch.

Those restrictions created a different problem: they undermined the core product promise. Subscribers had been sold unlimited access. Restrictions triggered complaints, cancellations, and significant press coverage about the unreliability of the service. The company tried to manage a unit economics crisis by degrading the product, which accelerated the subscriber decline that ultimately made the economics worse.

MoviePass filed for bankruptcy in September 2019, less than two years after the $9.95 launch.

## The Pattern in Subscription Businesses

MoviePass is an extreme case, but the underlying failure mode, a pricing model built on an assumption about user behaviour that nobody tested, is not unusual. Subscription businesses routinely make assumptions about churn, usage frequency, and customer composition that they could test before committing to a price or a structure.

The gym metaphor is a seductive one because it works so well in that context. But it does not transfer automatically to other categories. A subscription that only appeals to power users cannot use a model designed for casual ones.

For any subscription product, the pre-launch question is not "what is the average usage rate in the population?" It is "what is the expected usage rate among the people who would actually subscribe at this price?" Those are different populations with different behaviours. Getting that distinction wrong does not show up as a problem in the early growth metrics, it shows up in the unit economics, usually when the subscriber base is large enough that fixing the price becomes very difficult.

The data MoviePass needed was not proprietary or hard to obtain. They needed to model the right population and price accordingly. The decision to skip that step, or to rely on an analogy that did not hold, cost the company its existence.
