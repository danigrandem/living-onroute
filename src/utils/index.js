import { createClient } from "../prismicio";
import { notFound } from 'next/navigation'

export const getAllCategories = async () => {
  const client = createClient();
  const graphQuery = `
    {
      category {
        name
        slug
        level
        parent
      }
    }
    `;

  return await client.getAllByType("category", { graphQuery });
}

const filterCategories = (allCategories, type) => {
  return allCategories.filter(
    (category) => category.data.level === type
  );
}

export const getLevelCategories = async (type) => {
  const allCategories = await getAllCategories()


  return filterCategories(allCategories, type)
}

export const getParentSlugs = (slug, allCategories, slugs = []) => {
  // Encuentra la categoría correspondiente al slug actual
  const category = allCategories.find((cat) => cat.data.slug === slug);

  if (!category) {
    // Si no se encuentra la categoría, retorna los slugs acumulados
    return slugs;
  }

  // Agregar el slug actual al inicio del array
  slugs.unshift(category.data.slug);

  // Si tiene un parent, continuar recursivamente
  if (category.data.parent && category.data.parent.slug) {
    return getParentSlugs(category.data.parent.slug, allCategories, slugs);
  }

  // Si no tiene un parent, devolver los slugs acumulados
  return slugs;
}

export const getParents = (slug, allCategories, parents = []) => {
  // Encuentra la categoría correspondiente al slug actual
  const category = allCategories.find((cat) => cat.data.slug === slug);

  if (!category) {
    // Si no se encuentra la categoría, retorna los slugs acumulados
    return parents;
  }

  // Agregar el slug actual al inicio del array
  parents.unshift(category.data);

  // Si tiene un parent, continuar recursivamente
  if (category.data.parent && category.data.parent.slug) {
    return getParents(category.data.parent.slug, allCategories, parents);
  }

  // Si no tiene un parent, devolver los slugs acumulados
  return parents;
}


export const checkPath = async ({ continent = undefined, country = undefined, region = undefined }) => {
  const allCategories = await getAllCategories()

  if (region) {
    const regions = filterCategories(allCategories, 'region')
    const regionSelected = regions.find((c) => c.data.slug === region)
    if (!region) {
      notFound()
    } else {
      if (regionSelected.data.parent.slug !== country) {
        notFound()
      }
    }
  }

  if (country) {
    const countries = filterCategories(allCategories, 'country')
    const countrySelected = countries.find((c) => c.data.slug === country)
    if (!countries.find((c) => c.data.slug === country)) {
      notFound()
    } else {
      if (countrySelected.data.parent.slug !== continent) {
        notFound()
      }
    }
  }

  if (continent) {
    const continents = filterCategories(allCategories, 'continent')

    if (!continents.find((c) => c.data.slug === continent)) {
      notFound()
    }
  }

}

export const getChildArticles = async (category) => {
  const client = createClient();
  const graphQuery = `
  {
    article {
      title
      category {
        name
        slug
        level
        parent
      }
    }
  }
  `;

  const articles = await client.getAllByType("article", { graphQuery });
  // Filter articles dynamically where category.parent.slug === "asia"
  const childArticles = articles.filter(
    (article) => article.data.category?.data?.parent?.slug === category
  );

  const currentArticles = articles.filter(
    (article) => article.data.category?.slug === category
  );

  return { currentArticles, childArticles }
}

export async function getStaticParams(level) {
  const client = createClient();



  // Obtén los artículos directamente relacionados con continentes
  const graphQuery = `
  {
    article {
      title
      category {
        slug
        level
        parent {
          slug
          level
        }
      }
    }
  }
  `;

  const articles = await client.getAllByType("article", { graphQuery });

  const filteredArticles = articles.filter(
    (article) => article.data.category?.data.level === level
  );
  const allCategories = await getAllCategories()

  return filteredArticles.map((article) => {
    const slugs = getParentSlugs(article.data.category.slug, allCategories)
    return {
      continent: slugs[0],
      uid: article.uid,
      region: slugs?.[2],
      country: slugs?.[1]
    }
  }
  );
}