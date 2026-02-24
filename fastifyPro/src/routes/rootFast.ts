import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod'; // Importamos Zod

// Definimos el esquema de lo que esperamos del cliente
const UserSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});

const rootRoutes: FastifyPluginAsync = async (fastify) => {
  
  fastify.get('/usuarios', async () => {
    return await fastify.db.getUser();
  });

  fastify.post('/usuarios', async (request, reply) => {
    // 1. Validamos el body con Zod
    const result = UserSchema.safeParse(request.body);

    // 2. Si falla, mandamos el error detallado de Zod
    if (!result.success) {
      return reply.status(400).send({
        error: "Datos inválidos",
        detalles: result.error.flatten().fieldErrors
      });
    }

    // 3. Si llega aquí, "name" es 100% seguro y es un string
    const { name } = result.data; 
    const newUser = await fastify.db.SAuser(name);

    return reply.status(201).send({
      mensaje: 'Usuario guardado con éxito',
      data: newUser
    });
  });
};

export default rootRoutes;