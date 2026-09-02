import app from './src/app';

const start = async () => {
  await app.ready();
  console.log(app.printRoutes());
  process.exit(0);
};

start();
