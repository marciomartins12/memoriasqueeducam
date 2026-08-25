module.exports = {
  apps: [
    {
      name: 'memoriasqueeducam',
      script: 'server.js',
      cwd: '/var/www/memoriasqueeducam',

      instances: 1,
      exec_mode: 'fork',

      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },

      max_memory_restart: '350M',
      kill_timeout: 5000,
      listen_timeout: 10000,
      wait_ready: false,

      autorestart: true,
      watch: false,
      ignore_watch: [
        'node_modules',
        'src/public/img',
        '.git',
        '*.log'
      ],

      error_file: '/var/log/pm2/memoriasqueeducam-error.log',
      out_file: '/var/log/pm2/memoriasqueeducam-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      time: true
    }
  ]
};
