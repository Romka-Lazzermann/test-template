module.exports = {
  apps: [
    {
      name: "server-app",
      script: "./dist/index.js",
      instances: "max", // app logic only
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      env: {
        RUN_CRON: 'false',
      },
    },
    {
      name: "cron-worker",
      script: "./dist/index.js",
      exec_mode: "fork",
      instances: 1, // only one instance
      autorestart: true,
      watch: false,
      env: {
        RUN_CRON: 'true', // this is the only one that runs cron
      },
    }
  ]
};