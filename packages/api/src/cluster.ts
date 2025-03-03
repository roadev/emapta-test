import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master process ${process.pid} is running using ${numCPUs} cores.`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code}, signal ${signal}. Restarting...`);
    cluster.fork();
  });
} else {
  require('./');
  console.log(`Worker process ${process.pid} started.`);
}
