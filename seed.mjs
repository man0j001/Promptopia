/**
 * seed.mjs — DEV: seed MongoDB with the prompts in data/prompts.csv.
 *
 *   npm run seed                 # parse CSV, then insert into MongoDB
 *   npm run seed -- --dry-run    # parse + report only, NO database needed
 *
 * It creates ONE user per unique username (so a user's profile shows ALL of
 * their prompts), gives each user a unique random avatar, and points every
 * prompt at its author. No Google sign-in required.
 *
 * ⚠️  WIPES the `users` and `prompts` collections in `share_prompt`, then
 * reinserts. Don't run against a database with real data you want to keep.
 */

import mongoose from "mongoose";
import { readFileSync } from "fs";

const DRY_RUN = process.argv.includes("--dry-run");

// --- Load .env (no dotenv dependency) ---
try {
  const envFile = readFileSync(new URL("./.env", import.meta.url), "utf8");
  for (const line of envFile.split(/\r?\n/)) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      process.env[m[1]] = v;
    }
  }
} catch {
  /* no .env — only matters for a real (non-dry) run */
}

// --- Minimal RFC-4180 CSV parser (handles quotes, escaped quotes, commas, CRLF) ---
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\r") {
      /* ignore */
    } else if (c === "\n") {
      row.push(field); rows.push(row); row = []; field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

// --- Avatars: a rotation of illustrated DiceBear styles, deterministic per user ---
const AVATAR_STYLES = [
  "avataaars", "lorelei", "notionists", "micah",
  "adventurer", "personas", "open-peeps", "big-smile",
];
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000000007;
  return h;
}
function avatarFor(name) {
  const style = AVATAR_STYLES[hashStr(name) % AVATAR_STYLES.length];
  return `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(name)}`;
}

// --- Read + parse the CSV ---
const csvText = readFileSync(new URL("./data/prompts.csv", import.meta.url), "utf8");
const rows = parseCSV(csvText);
const dataRows = rows.slice(1); // drop header: No.,Category,Username,Prompt Title,Prompt Text

const userMap = new Map(); // username -> { username, email, image }
const promptItems = [];    // { username, title, prompt, tag }

for (const r of dataRows) {
  const category = (r[1] || "").trim();
  const username = (r[2] || "").trim().replace(/^@+/, ""); // strip leading @
  const title = (r[3] || "").trim();
  const prompt = (r[4] || "").trim();
  if (!username || !prompt) continue;

  if (!userMap.has(username)) {
    const emailLocal = username.toLowerCase().replace(/[^a-z0-9._-]/g, "") || `user${userMap.size}`;
    userMap.set(username, {
      username,
      email: `${emailLocal}@promptopia.dev`,
      image: avatarFor(username),
    });
  }
  promptItems.push({ username, title, prompt, tag: category || "general" });
}

const users = [...userMap.values()];

// --- Report (always) ---
const counts = {};
for (const p of promptItems) counts[p.username] = (counts[p.username] || 0) + 1;
const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
const multi = Object.values(counts).filter((c) => c >= 4).length;

console.log(`\nParsed ${promptItems.length} prompts across ${users.length} unique users.`);
console.log(`Users with 4+ prompts: ${multi}`);
console.log("Top authors:");
for (const [u, c] of top) console.log(`   ${u}: ${c} prompts`);
console.log("Sample user:", JSON.stringify(users[0]));

if (DRY_RUN) {
  console.log("\n(dry run) — no database changes made.\n");
  process.exit(0);
}

// --- Schemas (mirror models/user.js + models/prompt.js; no strict username regex so handles like @fazz are allowed) ---
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String, required: true },
  image: { type: String },
});
const PromptSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, trim: true },
  prompt: { type: String, required: true },
  tag: { type: String, required: true },
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Prompt = mongoose.models.Prompt || mongoose.model("Prompt", PromptSchema);

async function run() {
  if (!process.env.MONGODB_URL) {
    console.error("\n❌ MONGODB_URL is not set in .env — cannot seed the database.\n");
    process.exit(1);
  }

  mongoose.set("strictQuery", true);
  console.log("\n→ Connecting to MongoDB (db: share_prompt)...");
  await mongoose.connect(process.env.MONGODB_URL, { dbName: "share_prompt" });
  console.log("✓ Connected");

  console.log("→ Clearing existing users & prompts...");
  await Prompt.deleteMany({});
  await User.deleteMany({});

  console.log("→ Inserting users...");
  const createdUsers = await User.insertMany(users);
  const idByUsername = new Map(createdUsers.map((u) => [u.username, u._id]));

  console.log("→ Inserting prompts...");
  const promptDocs = promptItems.map((p) => ({
    creator: idByUsername.get(p.username),
    title: p.title,
    prompt: p.prompt,
    tag: p.tag,
  }));
  const createdPrompts = await Prompt.insertMany(promptDocs);

  await mongoose.disconnect();
  console.log(`\n✅ Done! Inserted ${createdUsers.length} users and ${createdPrompts.length} prompts.`);
  console.log("Start the app with `npm run dev` and refresh to see the cards.\n");
}

run().catch((err) => {
  console.error("\n❌ Seed failed:", err.message);
  process.exit(1);
});
