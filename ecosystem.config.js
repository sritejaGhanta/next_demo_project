module.exports = {
  apps : [{
    script: 'npm cache clean --force && rm -rf .next/ && npm run dev',
    watch: false
  }]

};
