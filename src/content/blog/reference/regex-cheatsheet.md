---
title: "Regex Cheatsheet"
pubDate: "22 June, 2026"
description: "My regex cheatsheet"
featured: false
readingTime: "4 min read"
---

This article contains my rough notes for regex from the book [Mastering Regular Expressions](https://www.oreilly.com/library/view/mastering-regular-expressions/0596528124) for my own reference.

Practice: [regex101.com](https://www.regex101.com)

Engine note: These examples are written for the **PCRE2** regex engine. Most of the basic syntax also works in JavaScript, Python, Java, etc., but lookbehinds, backreferences, `\w`, `\b`, and multiline behavior can vary by engine. They will not all work in POSIX regex or RE2-based engines.

## Anchors

### `^`

Start of a line. Pattern at the beginning of a line/string.

Example: `^cat`

Read: ‘beginning of a line followed by a ‘c’, followed by an ‘a’ followed by a ‘t’.

### `$`

End of a line. Pattern at the end of a line/string.

Example: `cat$`

## Character Classes

### `[]`

Character class. Matches any one of several characters provided.

Example: `gr[ae]y` - looks for either gray or grey.

Read: ‘g’ followed by an ‘r’ followed by either ‘a’ or ‘e’ followed by a y.

### `-`

Character class metacharacter: Matches a character within a range.

Example: `[A-Za-z0-9]`

Note: Works only inside `[]` and if it’s the first character, it cannot be a range. Therefore, it is interpreted as just a dash.

### `[^...]`

Negated Character Class: Matches a character not listed.

Example: `[^1-6]`

Read: A character that is not 1 through 6.

### `.`

Dot: Matches any character.

Example: `03.19.76`

Read: ‘0’ followed by a ‘3’ followed by ‘any character’ followed by a ‘1’ followed by a ‘9’ followed by ‘any character’ followed by a ‘7’ followed by a ‘6’.

Note: Inside a character class, it will be read only as a dot.

### `|`

Alternation (or): Matches ‘one of from’.

Example: `gr(a|e)y` reads gray or grey.

Note: Parentheses are required otherwise, it will read gra or ey. Inside character class, it’s not a meta-character, just a literal.

### `\`

Backslash: Before any metacharacter will turn that metacharacter into a literal.

Example: `\([A-Za-z]+\)` looks for a word in parentheses.

### `\w`

Word character. Matches any single letter, number or underscore. Same as `[a-zA-Z0-9_]`.

## Word Boundaries

### `\b`

Word ‘b’oundary: Matches a pattern by two characters where one is a word character and the other is not.

Example 1: `catmania thiscat thiscatmania cat.`

> `\bcat` - a non-word character (space in this case) must precede the word-characters (cat): matches cat in ‘catmania’ and ‘cat’.

> `cat\b` - a non-word character must follow the word-characters (cat): matches cat in ‘thiscat’ and ‘cat’.

> `\bcat\b` - a non-word character must precede and follow the word-characters (cat): matches the word ‘cat’.

Example 2: `nine-digit color - coded`

`\b-\b` - a word character must precede and follow the non-word (`-`): matches the `-` in ‘nine-digit’.

### `\B`

Word ‘B’oundary: Negates `\b`. Matches a pattern by two characters where both are either word characters or non-word characters.

Example 1: `catmania thiscat thiscatmania cat.`

> `\Bcat` - a word character has to precede the word character (c): matches cat in ‘thiscat’ and ‘thiscatmina’.

> `cat\B` - a word character has to follow the word character (t): matches cat in ‘catmania’ and ‘thiscatmania’.

> `\Bcat\B` - a word character has to precede the word character (c) and follow the word character (t): matches cat in ‘thiscatmania’.

Example 2: `nine-digit color - coded`

`\B-\B` - a non-word character (space) must follow the non-word character (`-`): matches the `-` between color and coded.

## Quantifiers

Specify the quantity of items. Work only on preceding character.

### `?`

Optional Items: Character preceded by `?` is optional.

Example: `July?` : y is optional. `(fourth|4(th)?)` th is optional.

### `*`

Star: Tries to match as much as it can, ok to match none.

Example: `<H1>`, `<H1 >` `<H1      >`.

`<H1 *>` matches zero more spaces.

### `+`

Plus: Tries to match as much it can, fails if none matches.

Example: `<H1 size = 14>`.

`<H1 + size = 14>` matches one or more space between H1 and size.

## Backreferencing

### `\1`, `\2`, `\3`…

The parentheses `()` can remember text matched by the expression they enclose. Backreferences can be used to refer to those matches.

Example: `\b([A-Za-z]+) +\1\b`

Explanation:

An expression for matching repeated words.

`\b` `\b` match a non-word character to the word character within `[A-Za-z]` (space in this case).

`[A-Za-z]` matches all individual characters. `[A-Za-z]+` matches words with one or more characters of the english alphabet.

`()` Remembers the current word that is enclosed in them.

`(space)+` looks for one or more space between the words.

`\1` references the word that was stored in the current `()`.

## Non-Capturing Group

### `(?: )`

Using simple parentheses `()` will group and capture the part of the text that we can backreference using `\1`, `\2` or variables. `(?: .....)` is used to only group and not capture so it increases optimization and avoids confusion.

Example: `^([-+]?[0-9]+(?:\.[0-9]+)?)([CF])$`

Explanation: For validating inputs like 32 F, 32.4C. `\1` will reference the first group (`[-+]?[0-9]+(?:\.[0-9]+)?`). `\2` will reference `([CF])` instead of `(?:\.[0-9]+)`.

## Lookarounds

### `(?= )`

Positive Lookahead: Matches the position of the text inside the parentheses in the right direction.

Read: Find a position where we can look to the right/ahead to find the text.

Example: `(?=Jeffrey)Jeff`.

Explanation: Finds the starting position of Jeffrey and selects the part Jeff in it. Find the starting position of Jeffrey and match if followed by Jeff.

### `(?! )`

Negative Lookahead: Finds the position where the given pattern is not found to the right.

Example: `Jeff(?!rey)` in `(Jefferson, Jeffrey)`. Selects Jeff in Jefferson and not in Jeffrey.

Explanation: Select Jeff if the pattern rey doesn’t appear to the right of it.

### `(?<= )`

Positive Lookbehind: Matches the position of the text inside the parentheses in the left direction.

Read: Find a position where we can look to the left/behind to find the text.

Example: `(?<=Jeff)rey`.

Explanation: Finds the ending position of Jeff in Jeffrey. Matches the part rey only if it was preceded by Jeff.

### `(?<! )`

Negative Lookbehind: Find the pattern where the given pattern is not found to the left.

Example: `(?<!Jeff)rey` in `(Jeffrey, Winfrey)`. Selects rey in Winfrey and not in Jeffrey.

## Detailed Examples

Text: “get Jeffs book”.

Pattern: `(?<=\bJeff)(?=s\b)`

Read: Look for a position where ‘Jeff’ is to the left and ‘s’ is to the right.

Result: Does not match the part Jeffs only the position between Jeff and s.

Text: `123456789`.

Pattern: `(?<=\d)(?=(\d\d\d)+(?!\d))`

Read: Look for a position where there is a digit to the left, one or more 3-digits to the right and not followed by another digit.

Result: Matches the position between 123 456 and 789.
