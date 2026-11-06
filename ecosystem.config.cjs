/** PM2 process file — used on AWS Lightsail so the site restarts if it crashes. */
module.exports = {
  apps: [
    {
      name: "balo",
      cwd: __dirname,
      script: "scripts/start-prod.mjs",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
