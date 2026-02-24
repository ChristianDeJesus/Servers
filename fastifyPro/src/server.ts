import Fastify from 'fastify';
import { config } from './config/env.js';

import rootRoutes from './routes/rootFast.js';
import dbP from './plugins/dbF.js';

const fastify = Fastify({ 
  logger: {  transport: { target: 'pino-pretty'   }     } 
});

const start = async () => {

    await fastify.register(dbP);

    await fastify.register(rootRoutes);
   
    try {
        await fastify.listen({ 
        port: config.PUERTO_Fast, 
        host: config.HOST_Fast
        });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();