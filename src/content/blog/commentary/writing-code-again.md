---
title: "Writing Code Again"
kicker: "I am still worthy."
description: "Thoughts on finding joy in software development writing code"
pubDate: "10 June, 2026"
featured: false
draft: true
---

This blog primarily exists to help bridge the gap between learning individual concepts and understanding how they fit together. Most of the posts will be about the ideas, algorithms, systems, and implementations behind software. That said, there is another reason this blog exists.

It's a daily occurrence now that I go online and see developers lamenting the state of programming. They feel burnt out because they miss writing code themselves, and that's the part they enjoyed the most, but now they spend their time reviewing AI slop, cleaning up technical debt, and dealing with pressure to ship faster and faster. They argue that AI has sucked the joy out of programming by turning it into prompt engineering and code review. 

There are developers who say they are more productive and getting things done faster because they can focus on the bigger ideas like architecture, system design, and product decisions, and not worry about low-level details like code. It's an abstraction like any other, they claim, and it saves you time so you can focus on things that matter. 

There are also developers who **LOVE** agentic software development. They swear that it is addictive. The better you get at it, the more you want to use it. It’s simultaneously satisfying, frustrating, and exhilarating. It doles out dopamine and adrenaline shots like they’re on a fire sale.[^1] 

## The Joy of Software Development

This post is not about which side is right or who is more of a software engineer. It's a waste of time debating that. After all, software engineering has a lot of different problems to solve and different people enjoy solving different problems. 

It also isn't a cure for every kind of burnout. Sometimes the problem is the job, the deadlines, the culture, or the expectations placed on you.

It is about trying to fight the burnout by doing the most enjoyable part of software development. What is the most enjoyable part of software engineering? That of course, is highly subjective.

It is worth asking the question I asked myself some time back: 

Did I really enjoy writing code or am I resisting the change brought on by AI because it's going to replace "our old ways"?

To find out, I decided to work on two projects. 

One that I would make "the old way" by writing code myself. So, I wrote a GUI in assembly. Hey, when I said writing code myself, I meant **writing code myself**.

The other would be vibe-coded: this blog.

## An Unscientific Experiment

"This blog is AI slop???" 

Before you grab your pitchforks, let's start with what is **not** AI.

- __The content__: If you've read this far, it might be very obvious that this is not written by AI since, and I'll admit this, the writing is all over the place. It's not one of my strengths but the only way to improve is to do it regardless.

  I do use AI to proofread. English is my second language and I have an ADHD diagnosis. So, there will be grammar and spelling mistakes. I will also forget to link or have other markup mistakes. There will be some redundancy in the text. I will repeat things when there is no need. To catch these mistakes and not derail the conversations, I do ask AI to proofread.

- __The implementations__: I will not have AI generate code for a topic I am writing about. If I implement a feature or build an app, I will do it without AI. If we talk about data structures, algorithms, or systems, the explanations will be based on my own understanding rather than AI generated.

- __The ideas__: I write about what I want to write about. I do not ask AI for suggestions or to analyze trends and see what's popular and will get me clicks.

- __The design of the site__: You can tell that I didn't have AI generate the design by the severe lack of purple in this site.

As I mentioned earlier, I did vibe-code this blog to know for myself if I actually enjoyed coding or if I was just resisting change.

Turns out ...drumrolls, please... I do enjoy coding. In fact, I wrote a GUI in assembly to contrast my experience with vibe coding the blog and, boy, what a contrast it was. It revitalized my life force, reignited the flame, and convinced me to touch grass. Despite the struggles, the dopamine hit from wrestling with the logic, fighting the bugs, and getting things to work is unmatched. There really is nothing like it[^2]. 

As for the vibe coding, I felt no satisfaction, no sense of accomplishment in prompting an AI with detailed specifications, having a back and forth about the implementation, and watching it write the code while I just watched it change files.

I can see why some developers would prefer it. I got to think more about the high-level design and AI did, indeed, build it faster than me. So, if that's what you enjoy and want from programming, more power to you.

## Meaningful Coding

The solution to burnout from coding is not less coding, it is meaningful coding. No deadlines, no manager, no AI, and no coworker who is holding you back. Just you, your IDE, and your favorite source of caffeine. 

"I don't have time to build things". 

You don't have to build the next billion-dollar app, you don't even have to build something that others would like. Just build something that you like. Try building something small. Maybe an algorithm you only ever learned the theory of. Maybe an abstraction that you use daily but have no idea how it works.

If you want some ideas on what to build next or want to learn "that thing you use but don't know how it works", I hope you find something useful on this blog.

I'd be interested in hearing what has helped others deal with burnout or what they're currently working on. Feel free to connect with me on LinkedIn.

## AI Beyond This Blog

I still, however, remain unconvinced that the software development process becomes faster in any meaningful way. After all, coding has never been the bottleneck, at least not for me. It has always been reviewing and accountability, both being the responsibilities of human beings. As long as humans are in the loop (and we always will be), that's where you'll find the bottleneck.[^3] 

Yes, it coded the blog in 5 minutes, which would take me 2 days to do, but I also spent a considerable amount of time before and after it to think about:

- the specification
- verifying the work
- understanding the codebase so I actually know where to look if something breaks

The last one I wouldn't need to do if I had just coded this myself. I could tell AI to fix it, but I don't have unlimited tokens, won't always have access to AI, or always have access to the specific model that wrote this code. 

It's also a lot cheaper if I can tell the AI where to look rather than have it burn through tokens to scan all my files. I have an `AGENTS.md` file but it's really concise since [research shows detailed AGENTS.md files actually hurt coding agents' performance](https://arxiv.org/abs/2602.11988).

A blog is really not a big, complex project. So, there was not really that much code to review (I still didn't review the tailwind slop), but I shudder at the thought of reviewing AI code in a larger and more complex system. Of course, because developers are now required to ship unrealistically fast, they just skip it and the software suffers all the more for it.

I can see how someone who is an experienced developer with more than 25 years of experience and unlimited tokens can be really productive with agentic coding but most developers do not have either of those. It is unrealistic to expect the same level of productivity from every developer.

There are some who suggest that we don't need to worry about the "Tech Debt" since if it becomes a problem, we can just ask AI to rewrite the entire codebase.

That statement sure is something.

## Beyond Implementation

There are plenty of interesting problems to solve beyond implementation. Whether system design, software architecture, and other big-picture problems are more your thing or you simply want to become a better engineer, have a look through [my recommendations](/blog/recommendations). I'll keep updating them with resources I find useful and I'll also write about these topics on this blog, so check back from time to time.

Regardless of where you find joy in software engineering, I do believe before using AI, you must understand what it is doing. After all, AI is an abstraction, and [abstractions leak](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/).

[^1]: From Steve Yegge's [medium article about how using AI is draining people](https://steve-yegge.medium.com/the-ai-vampire-eda6e4f07163)
[^2]: At least not legally.
[^3]: [Armin Ronacher - The Final Bottleneck](https://lucumr.pocoo.org/2026/2/13/the-final-bottleneck/)