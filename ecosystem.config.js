module.exports = {
  apps: [
    {
      name: 'buyonemedia-4070',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 4070
      }
    }
  ]
};
