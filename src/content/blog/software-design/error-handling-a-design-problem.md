---
title: "Error Handling Is a Design Problem"
kicker: "To err is human, to prepare is design"
description: "Error handling is not just try/catch. It is interface design, failure strategy, and deciding who should recover when something goes wrong"
pubDate: "30 June, 2026"
featured: true
---

Recently, I have been looking at a lot of AI-generated code, and I keep noticing the same thing: the error handling is an absolute tragedy.

That is not surprising. Error handling is already an afterthought in a lot of human-written code, and AI learned from that code. It often throws errors upward, catches too broadly, or just hides failures.

We'll look at one of those functions in a bit. Functionally (heh), it is very simple, but it hides multiple bugs.

The ideas are language/framework agnostic, but the examples need a language. Some languages have robust, built-in error handling mechanisms and force you to deal with errors (Rust, my beloved). Others will let you shoot yourself in the foot, like JavaScript.

So, JavaScript it is.

## The Design Problem

The reason I talk about errors as a design problem is simple: the more places an error has to be handled, the more complexity it adds.

Complexity is how difficult a program is to understand and change[^1]. A common reason a program is hard to understand is that a module - a function, a class, a controller - is doing too much. If a function has a lot of code to handle errors, it becomes difficult to understand and modify.

Consider this very simplified function that creates a post and returns a user-facing response. It needs to do a few simple things:

1. validate the request data
2. parse the request string
3. check user exists
4. fetch their preferences
5. save the post
6. write to cache
7. return a response to the user

These requirements are implemented by other functions. If something goes wrong, those functions throw errors.

```javascript
/**
  * @param {string} data - String containing request data 
  */
async function createPost(data) {
  if (!data || typeof data !== 'string') {
    throw new InvalidDataError(data);
  }
  
  const body = JSON.parse(data);

  let user;

  try {
    user = await getUser(body.userId);
  } catch {
    return new UserNotFoundError(body.userId);
  }

  // default preferences
  let preferences = {
    notifyOnReply: true,
  };

  try {
    preferences = await getUserPreferences(body.userId);
  } catch {
    // use default preferences
  }

  try {
    const post = await savePost({
      userId: user.id,
      postId: body.postId,
      text: body.text,
      notifyOnReply: preferences.notifyOnReply,
    });

    try {
      await storeInCache(post);
    } catch {
      return new CacheSaveError(post);
    }
  } catch {
    return new NotCreatedError(body);
  }

  return new Created();
}
```

It is hard to read because it handles many failures: some of its own and some from other functions. It should not have to understand every failure from every function it calls. The functions it calls are supposed to be abstractions, but they don't seem to have abstracted away their failures.

This is the real design problem: a lot of abstractions are only designed for the happy path and the failure path is neglected. These function calls add complexity because they are bad abstractions.

Two subtle bugs crept in because of this complexity. One happened due to a bad interface, and the other due to a bad strategy.

### Bad interfaces hide failure

An interface is a contract. The contract sets expectations of behavior. Here, the function signature is the interface: its name, parameters, return value, and failure behavior. Based on the interface, the caller can make certain assumptions and the linter/compiler can enforce that contract.

When people talk about how bad JavaScript is, they often point out behaviors that are ridiculous but rarely the real problem. Sure, it is interesting that `'b' + 'a' + + 'a' + 'a'` results in `baNaNa`[^2]. But for day-to-day development, `JSON.parse()` is a much better example.

If you know nothing about `JSON.parse()`, this call might look innocent:

```javascript
const body = JSON.parse(data);
```

Even if you look at the interface of the function, everything seems fine.

```typescript
JSON.parse(text: string, reviver?: ((this: any, key: string, value: any) => any) | undefined): any
```

Looking at the signature of `JSON.parse()`, what assumptions would you make? What could the linter or compiler enforce?

Turns out, `JSON.parse()` **really** wants a valid JSON string. If you don't pass one, or pass an empty string, it will throw an exception. 

Is there anything in the interface that says an exception will be thrown?

This is what I mean by a bad interface. The failure is part of the behavior, but not part of the contract.

<details>
<summary>The documentation mentions it</summary>

Yes, reading the documentation is important. But the documentation cannot be enforced. An interface can be.

Even if someone knows about a certain behavior, mistakes happen.

In some languages, the interface would be enforced by your linter or compiler and you'd be forced to handle it.

</details>

It is unfair to entirely blame `JSON.parse()` for this bug. JavaScript has no way to express that a function may throw exceptions. However, `JSON.parse()` still chose throwing as its failure strategy when it could have used one of the strategies we will use later. So it is still a bit responsible.

<details>
<summary>Can't TypeScript help with this?</summary>

The TypeScript compiler could force you to handle the `any` if your tsconfig says so but it will not tell you to wrap a `try/catch` around anything or make JavaScript exceptions checked.

What TypeScript can do is let you design your own explicit success/failure interfaces that you can apply consistently and remove the guesswork out of JavaScript function calls. 
</details>

For now, imagine JavaScript could tell us that `JSON.parse()` throws. Then, we could fix the first bug like this:

```javascript
/**
  * @param {string} data - String containing request data 
  */
async function createPost(data) {
  if (!data || typeof data !== 'string') {
    throw new InvalidDataError(data);
  }
  
  let body;
  
  try {
    body = JSON.parse(data);
  } catch {
    return new MalformedDataError(data);
  }

  // ... The rest of the function
}
```

### Bad strategies create failures

Imagine a post is successfully created in the database, but storing it in cache fails. The function returns an error to the user. 

What would the user do next? 

Most likely, they will try again and end up creating duplicates. The readers will make fun of them for saying the same thing twice. The readers will make fun of them for saying the same thing twice.

Caching is good but it is also optional in this case. If we cannot find the post in cache (a cache miss), we can query the database.

This bug exists because of a bad failure strategy: pushing the burden of failure to the caller. The `storeInCache` function puts the burden on `createPost`, and `createPost` puts the burden on its caller.

## Strategies

We have identified the reason these functions add complexity: they are not good abstractions.

Therefore, the best strategy to reduce complexity is to ask: "Does the caller need to know about this exact error?"

If the answer is yes, let the caller handle it.

Often, the caller does not need to know the exact error but only whether the operation succeeded. Everything else is an implementation detail and should be hidden (and your interface should reflect that honestly).

The following strategies avoid returning unnecessary failures. Try one of these before throwing the error to the caller.

### Return a known failure value

If we only need to know that a failure happened, and not which failure happened, we can represent all failures with a single known value.

If `getUser()` and `savePost()` can't return the resource - either because the resource does not exist or there was an error - they can return `null`. Here, `null` represents all failures.

The known failure value must be known by the caller and must be unambiguous. Here, we use `null` but if `null` can be a valid successful value, do not use `null`. In such cases, use a different value or strategy.

The general structure looks like this:

```javascript
function getResourceOrNull(value) {
  try {
    const resource = getResource(value);
    
    if (resource === null) {
      return null;
    }

    return resource;
  } catch (error) {
    // log, retry, cleanup, etc
    // ...
    return null;
  }
}
```

This is what the `createPost()` function looks like when we change `getUser()` and `savePost()` to this structure.

```javascript
/**
* @param {string} data - String containing request data 
*/
async function createPost(data) {  
  if (!data || typeof data !== 'string') {
    throw new InvalidDataError(data);
  }

  let body;
  
  try {
    body = JSON.parse(data);
  } catch {
    return new MalformedDataError(data);
  }

  const user = await getUserOrNull(body.userId);

  if (!user) {
    return new UserNotFoundError(body.userId);
  }
  
  // default preferences
  let preferences = {
    notifyOnReply: true,
  };

  try {
    preferences = await getUserPreferences(body.userId);
  } catch {
    // use default preferences
  }

  const post = await savePostOrNull({
    userId: user.id,
    postId: body.postId,
    text: body.text,
    notifyOnReply: preferences.notifyOnReply,
  });

  if (!post) {
    return new NotCreatedError(body);
  }

  try {
    await storeInCache(post);
  } catch {
    return new CacheSaveError(post);
  }

  return new Created();
}
```

This is better but we are not done. We removed the unnecessary error handling around `getUser()` and `savePost()` but the cache failure is still handled badly, and the preferences fallback still lives in the caller.

### Ask for a fallback

This is slightly different from returning a known failure value. In the previous strategy, the function decided what failure looks like. Here, the caller decides what value should be used if the operation fails.

Since the function cannot know in advance what the caller wants as a default value, the caller passes that value in a parameter.

This is the general structure of such functions:

```javascript
function getValueOrDefault(key, fallback) {
  try {
    const value = getValue(key);
    return value;
  } catch (error) {
    // log, retry, cleanup, etc.
    // ...
    return fallback;
  }
}
```

`getUserPreferences()` is an obvious candidate for this strategy. If there is no stored user preference, we don't care about the error. We just want to use default preferences. 

The function call simplifies:

```javascript
const preferences = await getUserPreferencesOrDefault(body.userId, {
  notifyOnReply: true,
});
```

The `JSON.parse()` call is also a candidate for this strategy. In a different function, we could pass a different default value for parsing failures. For example, we might want to fall back to an empty object if an invalid object string was passed.

In this function, we can't do anything if the request string is invalid. So, we'll return `null` as the default value. This only works because `null` is not a valid request body for creating a post.

This is what our updated function looks like:

```javascript
/**
* @param {string} data - String containing request data 
*/
async function createPost(data) {  
  if (!data || typeof data !== 'string') {
    throw new InvalidDataError(data);
  }

  const body = jsonParseOrDefault(data, null);

  if (!body) {
    return new MalformedDataError(data);
  }

  const user = await getUserOrNull(body.userId);

  if (!user) {
    return new UserNotFoundError(body.userId);
  }

  const defaultPreferences = {
    notifyOnReply: true,
  };
  
  const preferences = await getUserPreferencesOrDefault(body.userId, defaultPreferences);

  const post = await savePostOrNull({
    userId: user.id,
    postId: body.postId,
    text: body.text,
    notifyOnReply: preferences.notifyOnReply,
  });

  if (!post) {
    return new NotCreatedError(body);
  }

  try {
    await storeInCache(post);
  } catch {
    return new CacheSaveError(post);
  }

  return new Created();
}
```

Now the function is a lot more readable and predictable.

<details>
<summary>The Secret Third Bug</summary>

There were actually 3 bugs in the program, but only two were directly related to the article.

The third bug exists because the string `'null'` is valid JSON.

In the original function, it would pass the condition and also be successfully parsed by `JSON.parse()`:

```javascript
if (!data || typeof data !== 'string') {
  throw new InvalidDataError(data);
}

let body;

try {
  body = JSON.parse(data);
} catch {
  return new MalformedDataError(data);
}
```


It would only get caught later here:

```javascript
try {
  user = await getUser(body.userId); // null access error
} catch {
  return new UserNotFoundError(body.userId)
}
```

but the wrong error would be returned to caller, making it difficult to debug.

Our new version that uses the fallback handles this correctly since `null` is not a valid request body.
</details>

### Handle it internally

Often, an error is recoverable. For example, a connection to an external service might fail: Redis is unavailable, S3 rejects a write, or the connected database instance in a database cluster is removed.

In these cases, involving the caller only increases complexity since the function can recover from the error on its own.

<details>
<summary>What's S3?</summary>

S3 is a storage service that stores data as objects.

The most famous is the Amazon S3, but the S3 API has become the industry standard and not exclusive to Amazon.
</details>

<details>
<summary>What's a database cluster?</summary>

A database cluster is a collection of database instances.

A cluster is often created for redundancy, so there is more than 1 database instance. If one instance is down, the application can connect to another.
</details>

In our example, the `storeInCache` function throws an error if it can't store something in cache. If the cache is unavailable, it can use application memory as a temporary cache, put the operation in a queue to process later, or just ignore the error. 

Whatever the strategy, the cache function should handle this internally because it has enough context to do so.

After making the changes, our function looks like this:

```javascript
/**
* @param {string} data - String containing request data 
*/
async function createPost(data) {  
  if (!data || typeof data !== 'string') {
    throw new InvalidDataError(data);
  }

  const body = jsonParseOrDefault(data, null);

  if (!body) {
    return new MalformedDataError(data);
  }

  const user = await getUserOrNull(body.userId);

  if (!user) {
    return new UserNotFoundError(body.userId);
  }

  const defaultPreferences = {
    notifyOnReply: true,
  };
  
  const preferences = await getUserPreferencesOrDefault(body.userId, defaultPreferences);

  const post = await savePostOrNull({
    userId: user.id,
    postId: body.postId,
    text: body.text,
    notifyOnReply: preferences.notifyOnReply,
  });

  if (!post) {
    return new NotCreatedError(body);
  }

  await storeInCacheBestEffort(post);

  return new Created();
}
```

### Crash

Some errors are difficult or impossible to recover from. For example:

- out of memory errors
- invalid configuration
- cannot connect to the only database instance

Again, throwing the error upward does not help. There is nothing useful for the caller to do either.

The only thing the application can do is crash. And it should.

I know it sounds wrong.

There should, obviously, be a way to monitor, report, and recover from outside the application. For example, restarting the process for out of memory errors, launching a new instance in distributed systems or a developer fixing the configuration manually.

## Conclusion

Error handling should be part of the design process. Discussing failure early makes programs easier to read, debug and change.

In the age of AI, design decisions become even more important. AI is very good at producing code that looks right when everything works. It is much worse at deciding what failure means. It will happily generate functions that throw vague errors, hide bad interfaces, and push complexity upward until somebody else has to deal with it.

Whether you're writing code or prompting AI to write code, we still need to design failure.

[^1]: "Complexity is anything related to the structure of a software system that makes it hard to understand and modify the system." From [John K. Ousterhout A Philosophy of Software Design, 2nd Edition](https://www.amazon.com/dp/1732102201?ref=blog.pragmaticengineer.com)

[^2]: If you are a minion, I guess.