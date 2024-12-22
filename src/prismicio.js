import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import config from "../slicemachine.config.json";

/**
 * El nombre del repositorio de Prismic.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || config.repositoryName;

/**
 * Rutas para los documentos en Prismic. Estas rutas determinan cómo se mapean los documentos a las URLs.
 *
 * @type {prismic.ClientConfig['routes']}
 */
const routes = [
  {
    type: "article",
    path: "/:continent/article/:uid", // Directamente en el continente
    resolvers: {
      continent: "category",
    }
  },
  {
    type: "category",
    path: "/categories/:uid", // Para categorías (opcional)
  },
];

/**
 * Crea un cliente de Prismic para consultar la API.
 *
 * @param {prismicNext.CreateClientConfig} [config] - Configuración adicional para el cliente.
 */
export const createClient = (config = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes, // Incluye las rutas configuradas
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } }, // Configuración de caché y revalidación
    ...config,
  });

  // Habilita auto-previews para manejar vistas previas en Next.js
  prismicNext.enableAutoPreviews({ client });

  return client;
};
