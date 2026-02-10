// lib/shopify.js
// Utility functions for Shopify Storefront API

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

// ⚠️ IMPORTANT: Make sure your .env.local file uses:
// NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN (not _TOKEN at the end)

/**
 * Fetch data from Shopify Storefront API
 */
export async function shopifyFetch({ query, variables = {} }) {
  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      // Add caching for better performance
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }

    const data = await result.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return data;
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw error;
  }
}

/**
 * Get all products
 */
export async function getProducts(limit = 20) {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            id
            title
            description
            handle
            tags
            availableForSale
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({
    query,
    variables: { first: limit }
  });

  return data.data.products.edges.map(edge => formatProduct(edge.node));
}

/**
 * Get single product by handle
 */
export async function getProduct(handle) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        descriptionHtml
        handle
        tags
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 50) {
          edges {
            node {
              id
              title
              availableForSale
              quantityAvailable
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({
    query,
    variables: { handle }
  });

  return data.data.productByHandle ? formatProduct(data.data.productByHandle) : null;
}

/**
 * Get all collections
 */
export async function getCollections(limit = 10) {
  const query = `
    query getCollections($first: Int!) {
      collections(first: $first, sortKey: TITLE) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({
    query,
    variables: { first: limit }
  });

  return data.data.collections.edges.map(edge => formatCollection(edge.node));
}

/**
 * Get collection by handle
 */
export async function getCollection(handle) {
  const query = `
    query getCollection($handle: String!) {
      collectionByHandle(handle: $handle) {
        id
        title
        handle
        description
        image {
          url
          altText
        }
        products(first: 50) {
          edges {
            node {
              id
              title
              description
              handle
              tags
              availableForSale
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({
    query,
    variables: { handle }
  });

  if (!data.data.collectionByHandle) return null;

  const collection = data.data.collectionByHandle;

  return {
    ...formatCollection(collection),
    products: collection.products.edges.map(edge => formatProduct(edge.node))
  };
}

/**
 * Format product data
 */
function formatProduct(product) {
  const badge = determineBadge(product.tags);

  return {
    id: product.id,
    name: product.title,
    description: product.description?.substring(0, 200) || '',
    descriptionHtml: product.descriptionHtml,
    handle: product.handle,
    price: parseFloat(product.priceRange.minVariantPrice.amount),
    originalPrice: product.compareAtPriceRange?.minVariantPrice?.amount
      ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
      : null,
    image: product.images.edges[0]?.node.url || '',
    images: product.images.edges.map(edge => ({
      url: edge.node.url,
      altText: edge.node.altText || product.title,
      width: edge.node.width,
      height: edge.node.height
    })),
    badge,
    badgeColor: getBadgeColor(badge),
    availableForSale: product.availableForSale,
    tags: product.tags,
    variants: product.variants?.edges.map(edge => ({
      id: edge.node.id,
      title: edge.node.title,
      price: parseFloat(edge.node.price.amount),
      compareAtPrice: edge.node.compareAtPrice?.amount
        ? parseFloat(edge.node.compareAtPrice.amount)
        : null,
      availableForSale: edge.node.availableForSale,
      quantityAvailable: edge.node.quantityAvailable,
      selectedOptions: edge.node.selectedOptions
    })) || []
  };
}

/**
 * Format collection data
 */
function formatCollection(collection) {
  return {
    id: collection.handle,
    name: collection.title,
    description: collection.description || '',
    handle: collection.handle,
    image: collection.image?.url || '',
    imageAlt: collection.image?.altText || collection.title,
    link: `/collections/${collection.handle}`
  };
}

/**
 * Determine badge from product tags
 */
function determineBadge(tags) {
  if (!tags || tags.length === 0) return null;

  const lowerTags = tags.map(tag => tag.toLowerCase());

  if (lowerTags.includes('bestseller') || lowerTags.includes('best-seller') || lowerTags.includes('best seller')) {
    return 'Best Seller';
  }
  if (lowerTags.includes('sale') || lowerTags.includes('on-sale') || lowerTags.includes('on sale')) {
    return 'On Sale';
  }
  if (lowerTags.includes('rare') || lowerTags.includes('rare-plant') || lowerTags.includes('rare plant')) {
    return 'Rare Plant';
  }
  if (lowerTags.includes('new') || lowerTags.includes('new-arrival') || lowerTags.includes('new arrival')) {
    return 'New Arrival';
  }

  return null;
}

/**
 * Get badge color based on badge type
 */
function getBadgeColor(badge) {
  switch (badge) {
    case 'Best Seller':
      return 'bg-gray-800';
    case 'On Sale':
      return 'bg-red-600';
    case 'Rare Plant':
      return 'bg-purple-600';
    case 'New Arrival':
      return 'bg-blue-600';
    default:
      return 'bg-gray-800';
  }
}

/**
 * Search products
 */
export async function searchProducts(searchTerm, limit = 20) {
  const query = `
    query searchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            description
            handle
            tags
            availableForSale
            priceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({
    query,
    variables: {
      query: searchTerm,
      first: limit
    }
  });

  return data.data.products.edges.map(edge => formatProduct(edge.node));
}