import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import CardWrapper from "@/app/ui/dashboard/cards";
import { lusitana } from "@/app/ui/fonts";
import { fetchCardData } from "@/app/lib/data";
//apply suspense or streaming
import { Suspense } from "react";
import {
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";

export default async function Page() {

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}

// Una "cascada" se refiere a una secuencia de solicitudes de red que dependen de la finalización de solicitudes anteriores. En el caso de la obtención de datos, cada solicitud solo puede comenzar una vez que la solicitud anterior haya devuelto datos.

// Por ejemplo, debemos esperar a fetchRevenue()que se ejecute antes de fetchLatestInvoices()poder comenzar a ejecutarse, y así sucesivamente.

// Este patrón no es necesariamente malo. Puede haber casos en los que desees cascadas porque deseas que se cumpla una condición antes de realizar la siguiente solicitud. Por ejemplo, es posible que desees obtener primero la identificación y la información del perfil de un usuario. Una vez que tengas la identificación, puedes proceder a obtener su lista de amigos. En este caso, cada solicitud depende de los datos devueltos por la solicitud anterior.

// Sin embargo, este comportamiento también puede ser involuntario y afectar el rendimiento.

// Obtención de datos en paralelo
// Una forma común de evitar las cascadas es iniciar todas las solicitudes de datos al mismo tiempo, en paralelo.

// En JavaScript, puedes utilizar elPromise.all()oPromise.allSettled()funciones para iniciar todas las promesas al mismo tiempo. Por ejemplo, en data.ts, usamos Promise.all()en la fetchCardData()función:
