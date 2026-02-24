import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// 1. Definimos las REGLAS de nuestras variables
const envSchema = z.object({
  MSG_WELC_Fast: z.string().min(1, "El mensaje de bienvenida es obligatorio"),
  PUERTO_Fast: z.coerce.number().int().positive().default(3000), 
  HOST_Fast: z.string().default("localhost"),
});

// 2. Intentamos validar lo que hay en process.env
const result = envSchema.safeParse(process.env);

// 3. Si algo sale mal, matamos el proceso con un mensaje claro
if (!result.success) {
  console.error("❌ Error de configuración en .env:");
  console.table(result.error.flatten().fieldErrors); // Esto te da una tabla bonita con los errores
  process.exit(1); 
}

// 4. Exportamos los datos ya validados y tipados
export const config = result.data;