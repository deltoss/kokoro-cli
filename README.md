# CLI Tools

A Deno CLI wrapper around
[`kokoro-js`](https://www.npmjs.com/package/kokoro-js).

## Install

Install `kokoro` as a global Deno script:

```nu
deno task install
```

## Usage

```nu
# Pass text as arguments
kokoro Hello world --output "sound.wav"

# Show help
kokoro --help

# Pipe text through stdin
"Hello world" | kokoro --output "sound.wav"
```

## Development

```nu
deno task dev Hello world --output "sound.wav"
```

