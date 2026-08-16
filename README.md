# CLI Tools

A Deno CLI wrapper around
[`kokoro-js`](https://www.npmjs.com/package/kokoro-js).

## Run from source

From this directory, pass text as arguments:

```nu
deno run main.ts Hello world
```

Or pipe text through stdin:

```nu
"Hello world" | deno run main.ts
```

Show the generated help:

```nu
deno run main.ts --help
```

## Build and run the binary

```nu
deno task compile
```

Compile CLI binaries to `/bin`

Pass text as arguments:

```nu
../../bin/kokoro Hello world
```

Or pipe text through stdin:

```nu
"Hello world" | ../../bin/kokoro
```
