// lib/shopify_utilis.js
// Utility functions for Shopify Storefront API

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

interface ShopifyFetchParams {
  query: string;
  variables?: Record<string, any>;
}

/**
 * Fetch data from Shopify Storefront API
 */
export async function shopifyFetch({ query, variables = {} }: ShopifyFetchParams) {
  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
      }),
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 3600 }
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

/* =====================================================
   SHOPIFY CART QUERIES & MUTATIONS
===================================================== */

/* ===============================
   CREATE CART
================================ */
export const CREATE_CART = `
  mutation createCart {
    cartCreate {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
    }
  }
`;

/* ===============================
   GET CART
================================ */
export const GET_CART = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  id
                  title
                  handle
                  featuredImage {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/* ===============================
   ADD TO CART
================================ */
export const ADD_TO_CART = `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
      }
    }
  }
`;

/* ===============================
   UPDATE CART LINE ( + / - )
================================ */
export const UPDATE_CART_LINE = `
  mutation updateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
      }
    }
  }
`;

/* ===============================
   REMOVE CART LINE
================================ */
export const REMOVE_CART_LINE = `
  mutation removeCartLine($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        totalQuantity
      }
    }
  }
`;


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

  return data.data.products.edges.map((edge: any) => formatProduct(edge.node));
}

/**
 * Get new arrival products
 */
export async function getNewArrivals(limit = 8) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const query = `
    query getNewArrivals($first: Int!, $query: String!) {
      products(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            title
            description
            handle
            tags
            availableForSale
            createdAt
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
    variables: {
      first: limit,
      query: `created_at:>${thirtyDaysAgo.toISOString()}`
    }
  });

  return data.data.products.edges.map((edge: any) => formatProduct(edge.node));
}

/**
 * Get products by tag - SINGLE DEFINITION
 */
export async function getProductsByTag(tag: string, limit = 100) {
  const query = `
    query getProductsByTag($first: Int!, $query: String!) {
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
    variables: {
      first: limit,
      query: `tag:${tag}`
    }
  });

  return data.data.products.edges.map((edge: any) => formatProduct(edge.node));
}

/**
 * Get products by collection - FIXED TO INCLUDE VARIANTS
 */
export async function getProductsByCollection(handle: string, first = 100) {
  const query = `
    query getProductsByCollection($handle: String!, $first: Int!) {
      collectionByHandle(handle: $handle) {
        title
        handle
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              description
              tags
              availableForSale
              priceRange {
                minVariantPrice {
                  amount
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
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
    }
  `;

  try {
    const data = await shopifyFetch({
      query,
      variables: { handle, first }
    });

    if (!data?.data?.collectionByHandle) {
      console.warn(`Collection "${handle}" not found, returning empty array`);
      return [];
    }

    return data.data.collectionByHandle.products.edges.map(({ node }: any) => formatProduct(node));
  } catch (error) {
    console.error(`Error fetching products from collection "${handle}":`, error);
    return [];
  }
}

/**
 * Get single product by handle
 */
export async function getProduct(handle: string) {
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

  return data.data.collections.edges.map((edge: any) => formatCollection(edge.node));
}

/**
 * Get collection by handle - FIXED VERSION
 */
export async function getCollection(handle: string) {
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
    }
  `;

  const data = await shopifyFetch({
    query,
    variables: { handle }
  });

  console.log('🔍 Shopify API Response for collection:', handle);
  console.log('🔍 Full response:', JSON.stringify(data, null, 2));

  if (!data.data.collectionByHandle) {
    console.log('❌ collectionByHandle is null or undefined');
    return null;
  }

  const collection = data.data.collectionByHandle;

  console.log('🔍 Collection title:', collection.title);
  console.log('🔍 Collection handle:', collection.handle);
  console.log('🔍 Products edges:', collection.products.edges);
  console.log('🔍 Number of product edges:', collection.products.edges.length);

  const formattedProducts = collection.products.edges.map((edge: any) => formatProduct(edge.node));
  console.log('🔍 Formatted products:', formattedProducts);
  console.log('🔍 Number of formatted products:', formattedProducts.length);

  return {
    ...formatCollection(collection),
    products: formattedProducts
  };
}

/**
 * Format product data
 */
function formatProduct(product: any) {
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
    images: product.images.edges.map((edge: any) => ({
      url: edge.node.url,
      altText: edge.node.altText || product.title,
      width: edge.node.width,
      height: edge.node.height
    })),
    badge,
    badgeColor: getBadgeColor(badge),
    availableForSale: product.availableForSale,
    tags: product.tags,
    variants: product.variants?.edges.map((edge: any) => ({
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
function formatCollection(collection: any) {
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
function determineBadge(tags: string[]) {
  if (!tags || tags.length === 0) return null;

  const lowerTags = tags.map((tag: string) => tag.toLowerCase());

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
function getBadgeColor(badge: string | null) {
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
export async function searchProducts(searchTerm: string, limit = 20) {
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
    variables: {
      query: searchTerm,
      first: limit
    }
  });

  return data.data.products.edges.map((edge: any) => formatProduct(edge.node));
}

/**
 * Get products with fallback support
 * Tries primary collection, falls back to getProducts if not found
 */
export async function getProductsWithFallback(
  collectionHandle: string,
  limit = 100
): Promise<any[]> {
  try {
    const products = await getProductsByCollection(collectionHandle, limit);
    if (products.length > 0) {
      return products;
    }
    // Fallback to all products if collection is empty
    console.warn(`Collection "${collectionHandle}" is empty, using all products`);
    return await getProducts(limit);
  } catch (error) {
    console.error(`Failed to fetch from collection, using fallback:`, error);
    return await getProducts(limit);
  }
}

/**
 * Get all available collections with error handling
 */
export async function getAllCollections(limit = 50) {
  try {
    return await getCollections(limit);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

/**
 * Search and filter products
 */
export async function filterProducts(
  searchTerm?: string,
  tag?: string,
  limit = 100
): Promise<any[]> {
  try {
    if (tag) {
      return await getProductsByTag(tag, limit);
    }
    if (searchTerm) {
      return await searchProducts(searchTerm, limit);
    }
    return await getProducts(limit);
  } catch (error) {
    console.error('Error filtering products:', error);
    return [];
  }
}

/**
 * Get single product by handle with full details
 */
export async function getProductDetails(handle: string) {
  try {
    const product = await getProduct(handle);
    return product;
  } catch (error) {
    console.error(`Error fetching product details for "${handle}":`, error);
    return null;
  }
}

/* =====================================================
   CUSTOMER AUTHENTICATION & WISHLIST
===================================================== */

/**
 * Customer Login
 */
export async function customerLogin(email: string, password: string) {
  const mutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch({
    query: mutation,
    variables: {
      input: {
        email,
        password
      }
    }
  });

  return data.data.customerAccessTokenCreate;
}

/**
 * Get Customer Data (including wishlist from metafield)
 */
export async function getCustomerData(accessToken: string) {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
        metafield(namespace: "custom", key: "wishlist") {
          value
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch({
      query,
      variables: { customerAccessToken: accessToken }
    });

    if (!data.data.customer) {
      return null;
    }

    const customer = data.data.customer;
    const wishlistData = customer.metafield?.value;

    return {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      wishlist: wishlistData ? JSON.parse(wishlistData) : []
    };
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return null;
  }
}

/**
 * Update Customer Wishlist
 * Note: This uses the Customer Update API which requires proper metafield setup in Shopify Admin
 */
export async function updateCustomerWishlist(accessToken: string, wishlistItems: any[]) {
  const mutation = `
    mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
        customer {
          id
          metafield(namespace: "custom", key: "wishlist") {
            value
          }
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch({
      query: mutation,
      variables: {
        customerAccessToken: accessToken,
        customer: {
          metafields: [
            {
              namespace: "custom",
              key: "wishlist",
              value: JSON.stringify(wishlistItems),
              type: "json"
            }
          ]
        }
      }
    });

    if (data.data.customerUpdate.customerUserErrors.length > 0) {
      console.error('Customer update errors:', data.data.customerUpdate.customerUserErrors);
      throw new Error(data.data.customerUpdate.customerUserErrors[0].message);
    }

    return data.data.customerUpdate.customer;
  } catch (error) {
    console.error('Error updating wishlist:', error);
    throw error;
  }
}

/**
 * Logout Customer
 */
export async function customerLogout(accessToken: string) {
  const mutation = `
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch({
    query: mutation,
    variables: { customerAccessToken: accessToken }
  });

  return data.data.customerAccessTokenDelete;
}