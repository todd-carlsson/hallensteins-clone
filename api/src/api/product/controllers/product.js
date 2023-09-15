'use strict';

/**
 * product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product', ({ strapi }) => ({
    async find(ctx) {
        // @ts-ignore
        let { data, meta } = await super.find(ctx);
        const { customsort } = ctx.request.query

        function getShuffledArr(arr) {
            const newArr = arr.slice()
            for (let i = newArr.length - 1; i > 0; i--) {
                const rand = Math.floor(Math.random() * (i + 1));
                [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
            }
            return {data: newArr, meta}
        };

        // Calculate the minimum price and sort the products
        if (customsort) {
            if (customsort === 'lowest') {
                const sortedProducts = data.sort((productA, productB) => {
                    const minPriceA = Math.min(productA.attributes.price, productA.attributes.salePrice || productA.attributes.price);
                    const minPriceB = Math.min(productB.attributes.price, productB.attributes.salePrice || productB.attributes.price);
                    return minPriceA - minPriceB;
                });
                return { data: sortedProducts, meta };
            }
            else if (customsort === 'highest') {
                const sortedProducts = data.sort((productA, productB) => {
                    const minPriceA = Math.min(productA.attributes.price, productA.attributes.salePrice || productA.attributes.price);
                    const minPriceB = Math.min(productB.attributes.price, productB.attributes.salePrice || productB.attributes.price);
                    return minPriceB - minPriceA;
                });
                return { data: sortedProducts, meta };
            }
            else if (customsort === 'random') return getShuffledArr(data)
            else return { data, meta };
        }
        else return { data, meta };
        
    }
}));



