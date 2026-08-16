# CLI Tools

A Deno CLI wrapper around
[`kokoro-js`](https://www.npmjs.com/package/kokoro-js).

## Run from source

```nu
# Pass text as arguments
deno run dev Hello world

# Show the generated help:
deno run dev --help

# Pipe text through stdin:
"Hello world" | deno run dev
```

## Build and run the binary

```nu
deno task compile
```

Compile CLI binaries to `/bin`

```nu
# Pass text as arguments
bin/kokoro Hello world

# Pipe text via stdin
"Hello world" | bin/kokoro
```

