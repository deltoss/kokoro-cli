import { type GenerateOptions, KokoroTTS } from "kokoro-js";
import { Command, EnumType } from "@cliffy/command";

const logLevelType = new EnumType(["debug", "info", "warn", "error"]);
const DEFAULT_MODEL = "onnx-community/Kokoro-82M-v1.0-ONNX";

type Voice = NonNullable<GenerateOptions["voice"]>;
function isVoice(value: string, tts: KokoroTTS): value is Voice {
  return Object.hasOwn(tts.voices, value);
}
const DEFAULT_VOICE = "af_heart";

const deviceType = new EnumType(["cpu", "wasm", "webgpu"]);
const DEFAULT_DEVICE = "cpu";

await new Command()
  .name("kokoro")
  .description("Custom CLI wrapper around kokoro.js")
  .example(
    "Generate speech",
    "kokoro -o speech.wav 'Hello from Kokoro'",
  )
  .example(
    "Read text from stdin",
    "'Hello from stdin' | kokoro -o speech.wav",
  )
  .example(
    "Choose a voice",
    "kokoro --voice af_bella -o speech.wav 'Hello'",
  )
  .globalType("log-level", logLevelType)
  .globalEnv("DEBUG=<enable:boolean>", "Enable debug output.")
  .globalOption("--debug", "Enable debug output.")
  .globalOption("-l, --log-level <level:log-level>", "Set log level.", {
    default: "info",
  })
  .arguments("[words...]", ["Words to process"])
  .option("-o, --output <path:string>", "The file to save the TTS output to.", {
    required: true,
  })
  .option(
    "-v, --voice <voice:string>",
    "The voice to use. See https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX#samples",
    {
      default: DEFAULT_VOICE,
    },
  )
  .option("-m, --model <model:string>", "The model to use.", {
    default: DEFAULT_MODEL,
  })
  .type("device", deviceType)
  .option(
    "-d, --device <device:device>",
    "The device to use for the TTS. 'wasm', 'webgpu' (web) or 'cpu' (node). If using 'webgpu', we recommend using dtype='fp32'.",
    {
      default: "cpu",
    },
  )
  .action(async (options, ...words) => {
    if (!words.length && Deno.stdin.isTerminal()) {
      console.error("Provide text as arguments or through stdin.");
      Deno.exit(1);
    }

    const text = words.length
      ? words.join(" ")
      : await new Response(Deno.stdin.readable).text();

    const tts = await KokoroTTS.from_pretrained(options.model, {
      dtype: "q8", // "fp32", "fp16", "q8", "q4", "q4f16"
      device: options.device,
    });

    if (!isVoice(options.voice, tts)) {
      console.error(`Unknown voice: ${options.voice}`);
      Deno.exit(1);
    }

    const audio = await tts.generate(text, {
      // For available voices, see:
      // https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX#samples
      voice: options.voice,
    });

    audio.save(options.output);
  })
  .parse();
