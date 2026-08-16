import { KokoroTTS } from "kokoro-js";
import { Command, EnumType } from "@cliffy/command";

const logLevelType = new EnumType(["debug", "info", "warn", "error"]);
const DEFAULT_MODEL = "onnx-community/Kokoro-82M-v1.0-ONNX";

await new Command()
  .name("kokoro")
  .description("Custom CLI wrapper around kokoro.js")
  .globalType("log-level", logLevelType)
  .globalEnv("DEBUG=<enable:boolean>", "Enable debug output.")
  .globalOption("-d, --debug", "Enable debug output.")
  .globalOption("-l, --log-level <level:log-level>", "Set log level.", {
    default: "info",
  })
  .arguments("[words...]", ["Words to process"])
  .option("-m, --model <type:string>", "The model to use.", {
    default: DEFAULT_MODEL,
  })
  .action(async (options, ...words) => {
    if (!words.length && Deno.stdin.isTerminal()) {
      console.error("Provide text as arguments or through stdin.");
      Deno.exit(1);
    }

    const text = words.length
      ? words.join(" ")
      : await new Response(Deno.stdin.readable).text();

    const tts = await KokoroTTS.from_pretrained(options.model, {
      dtype: "q8", // Options: "fp32", "fp16", "q8", "q4", "q4f16"
      device: "cpu", // Options: "wasm", "webgpu" (web) or "cpu" (node). If using "webgpu", we recommend using dtype="fp32".
    });

    const audio = await tts.generate(text, {
      // Use `tts.list_voices()` to list all available voices
      // Or see: https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX#samples
      voice: "af_heart",
    });

    audio.save("audio.wav");
  })
  .parse();
