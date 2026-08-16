
import { spawn } from "node:child_process";
import concurrentlyPkg from "concurrently";

const concurrently = concurrentlyPkg.concurrently ?? concurrentlyPkg;
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

const isProduction = process.env.VITE_VERCEL_ENV === "production";

if (isProduction) {
  // Hosted build: no local chain. The frontend reads public/deployment.json and
  // talks to the live public RPC for the deployed chain.
  console.log("[smart-dev] VITE_VERCEL_ENV=production — serving the frontend only.");
  const child = spawn(npx, ["vite", "--host", "--port", "3000"], {
    stdio: "inherit",
    env: process.env,
  });
  const forward = (signal) => () => {
    try {
      child.kill(signal);
    } catch {
      /* already gone */
    }
  };
  process.on("SIGINT", forward("SIGINT"));
  process.on("SIGTERM", forward("SIGTERM"));
  child.on("exit", (code) => process.exit(code ?? 0));
} else {
  console.log("[smart-dev] local mode — Hardhat node + contract deploy + Vite dev server.");

  const { result, commands } = concurrently(
    [
      {
        command: `${npx} hardhat node --hostname 0.0.0.0 --port 8545`,
        name: "chain",
        prefixColor: "yellow",
      },
      {
        command: "node scripts/wait-and-deploy.js",
        name: "deploy",
        prefixColor: "magenta",
      },
      {
        command: `${npx} vite --host --port 3000`,
        name: "web",
        prefixColor: "cyan",
      },
    ],
    {
      prefix: "name",
      // Only tear everything down when something actually FAILS. The deploy command
      // exits 0 on success and must not kill the node or the dev server.
      killOthers: ["failure"],
      restartTries: 0,
      handleInput: false,
    }
  );

  let shuttingDown = false;
  const shutdown = (code) => {
    if (shuttingDown) return;
    shuttingDown = true;
    for (const command of commands) {
      try {
        command.kill("SIGTERM");
      } catch {
        /* process already exited */
      }
    }
    setTimeout(() => process.exit(code), 300);
  };

  process.on("SIGINT", () => shutdown(0));
  process.on("SIGTERM", () => shutdown(0));

  result.then(
    () => shutdown(0),
    (error) => {
      console.error("[smart-dev] a process failed:", error?.message ?? error);
      shutdown(1);
    }
  );
}
