import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

// 1. Definimos la interfaz de lo que vamos a inyectar
interface User {
  id: number;
  name: string;
}

interface MyDb {
  SAuser: (nombre: string) => Promise<User>;
  getUser: () => Promise<User[]>;
}


declare module 'fastify' {
  interface FastifyInstance {
    db: MyDb;
  }
}

const dbPlugin = fp(async (fastify: FastifyInstance) => {
  
  const users: User[] = [];

  const dbConnection: MyDb = {
    SAuser: async (nombre: string) => {
      const newUser: User = { id: users.length + 1, name: nombre };
      users.push(newUser);
      return newUser;
    },
    getUser: async () => {
      return users;
    }
  };

  fastify.decorate('db', dbConnection);
  fastify.log.info('🔌 Plugin de DB (Memoria) cargado');
});

export default dbPlugin;