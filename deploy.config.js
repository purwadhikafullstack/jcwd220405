module.exports = {
  apps: [
    {
      name: "JCWD-2204-05", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8405,
      },
      time: true,
    },
  ],
};
