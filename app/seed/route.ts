import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seedUsers(),
      seedCustomers(),
      seedInvoices(),
      seedRevenue(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}



// En Next.js (a partir de la versión 13 con el App Router), cada carpeta puede contener un archivo especial llamado route.ts (o route.js) que define automáticamente endpoints para las distintas peticiones HTTP (GET, POST, etc.). No es necesario configurar manualmente un servidor Express, ni declarar rutas en un archivo separado como en versiones anteriores o en frameworks tradicionales.

// La forma en que funciona es la siguiente:

// Estructura de carpetas
// Dentro de la carpeta app, cada subcarpeta puede representar una “ruta” en tu aplicación. Por ejemplo:

// markdown
// Copy
// app/
//   seed/
//     route.ts
//   ...
// La carpeta seed define la ruta /seed.
// El archivo route.ts en esa carpeta implementa las funciones que manejarán las peticiones HTTP (por ejemplo, GET, POST, etc.).
// Exportar funciones con nombre del método HTTP
// En tu archivo route.ts, exportas funciones nombradas con el método HTTP que quieras manejar, como export async function GET() {...}, POST() {...}, etc. Cuando alguien hace una petición a /seed (por ejemplo, desde el navegador), Next.js buscará la función GET dentro de app/seed/route.ts y la ejecutará.

// Por qué al ir a localhost:3000/seed se llama a la función GET

// Next.js 13 detecta automáticamente la función GET en route.ts y la expone como endpoint.
// Si abres tu navegador en localhost:3000/seed, Next.js responde con el resultado de la función GET que exportaste.
// No necesitas Express
// Next.js internamente se encarga de montar un servidor (o usar un entorno “serverless”/“edge” según la configuración) y exponer esas rutas sin que tengas que usar express() ni app.get(...).

// Esta es la gran diferencia con el sistema de rutas del Next.js “antiguo” (páginas dentro de pages/api/...) o con aplicaciones tradicionales de Node.js/Express.
// ¿Por qué no ves el archivo en la ruta “física” de /seed en producción?

// Next.js transpila y compila tu código internamente. No hay una correspondencia directa 1:1 en producción entre tus archivos y el árbol de rutas que se ve en un servidor Express.
// Simplemente, Next.js sabe que si alguien pide /seed, debe ejecutar lo que hay en app/seed/route.ts.
// En resumen, Next.js con el App Router se encarga de todo el enrutamiento y de llamar a la función que hayas exportado con el nombre del método HTTP (GET, POST, etc.). Por eso, al hacer una petición a localhost:3000/seed, automáticamente se invoca la función GET y se ejecuta tu lógica (en tu caso, seedea la base de datos).