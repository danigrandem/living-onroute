import { createClient } from "../prismicio";
import { notFound } from 'next/navigation'

export const getAllCategories = async() => {
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

export const getLevelCategories = async(type) => {
    const allCategories = await getAllCategories()
   
    
    return filterCategories(allCategories, type)
}



export const checkPath = async({continent=undefined,country=undefined,region=undefined}) => {
    const allCategories = await getAllCategories()

    if(region){
        const regions = filterCategories(allCategories, 'region')
        const regionSelected = regions.find((c) => c.data.slug === region)
        if(!region){
            notFound()
        } else {
            if(regionSelected.data.parent.slug !== country){
                notFound()
            }
        }
    }

    if(country){
        const countries = filterCategories(allCategories, 'country')
        const countrySelected = countries.find((c) => c.data.slug === country)
        if(!countries.find((c) => c.data.slug === country)){
            notFound()
          }else{
            if(countrySelected.data.parent.slug !== continent){
                notFound()
            }
          }
    }

    if(continent){
        const continents = filterCategories(allCategories, 'continent')
       
        if(!continents.find((c) => c.data.slug === continent)){
            notFound()
          }
    }

   
    
}