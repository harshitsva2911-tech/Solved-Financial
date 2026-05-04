module.exports = {
  apps: [
    {
      name: 'solved-financial-api',
      script: 'server.js',
      instances: 'max',       // one process per CPU core
      exec_mode: 'cluster',   // cluster mode for zero-downtime reloads
      watch: false,
      max_memory_restart: '512M',

      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },

      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },

      // Logging
      error_file: '/var/log/pm2/solved-financial-error.log',
      out_file: '/var/log/pm2/solved-financial-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Auto-restart on crash
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
