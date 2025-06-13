module.exports = {
  apps: [
    {
      name: "client-app",
      script: "node_modules/next/dist/bin/next",
 
      args: "start -p 3000", 
      cwd: "/home/roma/tripointhome/test-template/client/", 
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
