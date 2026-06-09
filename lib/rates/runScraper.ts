import { config } from "dotenv";
import { runMortgageRateScrapeAndClose } from "@/lib/rates/run";
import type { RateScrapeMethod, RateScrapeTrigger } from "@/lib/rates/types";

config({ path: ".env.local" });
config();

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value] as const;
  }),
);

runMortgageRateScrapeAndClose({
  mode: parseMode(args.get("mode")),
  trigger: parseTrigger(args.get("trigger")),
  sourceLimit: parsePositiveInt(args.get("limit")),
  dryRun: args.get("dry-run") === "true",
})
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

function parseMode(value: string | undefined): RateScrapeMethod | undefined {
  if (value === "browser" || value === "fetch_html") return value;
  return undefined;
}

function parseTrigger(value: string | undefined): RateScrapeTrigger | undefined {
  if (value === "manual" || value === "schedule_10am" || value === "schedule_3pm") return value;
  return undefined;
}

function parsePositiveInt(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : undefined;
}
