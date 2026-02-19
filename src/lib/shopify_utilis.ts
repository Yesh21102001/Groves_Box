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

export async function getOrderByNumber(accessToken: string, orderNumber: string) {
  // Normalize — strip the # if present
  const normalized = String(orderNumber).replace('#', '').trim();

  try {
    // Fetch up to 50 recent orders and find the matching one
    const orders = await getCustomerOrders(accessToken, 50);

    if (!orders || orders.length === 0) return null;

    const matched = orders.find(
      (o: any) =>
        String(o.orderNumber) === normalized ||
        o.id === `#${normalized}` ||
        o.id === normalized
    );

    return matched || null;
  } catch (error) {
    console.error('Error fetching order by number:', error);
    return null;
  }
}

/**
 * Get the most recent order for a customer
 * Useful for showing the last order on the success page
 * when no order number is available yet.
 */
export async function getLatestOrder(accessToken: string) {
  try {
    const orders = await getCustomerOrders(accessToken, 1);
    return orders?.[0] || null;
  } catch (error) {
    console.error('Error fetching latest order:', error);
    return null;
  }
}

// lib/shopify_customer_utils.ts
// Extended Shopify customer utilities for account management

/**
 * Get Customer Orders
 */
export async function getCustomerOrders(accessToken: string, limit = 10) {
  const query = `
    query getCustomerOrders($customerAccessToken: String!, $first: Int!) {
      customer(customerAccessToken: $customerAccessToken) {
        orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              orderNumber
              name
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice {
                amount
                currencyCode
              }
              subtotalPrice {
                amount
                currencyCode
              }
              totalShippingPrice {
                amount
                currencyCode
              }
              totalTax {
                amount
                currencyCode
              }
              shippingAddress {
                address1
                address2
                city
                province
                zip
                country
                phone
              }
              lineItems(first: 50) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      image {
                        url
                        altText
                      }
                      product {
                        handle
                      }
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
      variables: { customerAccessToken: accessToken, first: limit }
    });

    if (!data?.data?.customer) {
      return [];
    }

    return data.data.customer.orders.edges.map(({ node }: any) => formatOrder(node));
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return [];
  }
}

/**
 * Get Customer Addresses
 */
export async function getCustomerAddresses(accessToken: string) {
  const query = `
    query getCustomerAddresses($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        addresses(first: 10) {
          edges {
            node {
              id
              firstName
              lastName
              address1
              address2
              city
              province
              zip
              country
              phone
            }
          }
        }
        defaultAddress {
          id
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch({
      query,
      variables: { customerAccessToken: accessToken }
    });

    if (!data?.data?.customer) {
      return [];
    }

    const defaultAddressId = data.data.customer.defaultAddress?.id;
    return data.data.customer.addresses.edges.map(({ node }: any) => ({
      ...node,
      isDefault: node.id === defaultAddressId
    }));
  } catch (error) {
    console.error('Error fetching customer addresses:', error);
    return [];
  }
}

/**
 * Create Customer Address
 */
export async function createCustomerAddress(
  accessToken: string,
  address: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone?: string;
  }
) {
  const mutation = `
    mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        customerAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          zip
          country
          phone
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
        address: {
          ...address,
          address2: address.address2 || '',
          phone: address.phone || ''
        }
      }
    });

    if (data.data.customerAddressCreate.customerUserErrors.length > 0) {
      throw new Error(data.data.customerAddressCreate.customerUserErrors[0].message);
    }

    return data.data.customerAddressCreate.customerAddress;
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
}

/**
 * Update Customer Address
 */
export async function updateCustomerAddress(
  accessToken: string,
  addressId: string,
  address: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone?: string;
  }
) {
  const mutation = `
    mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
      customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
        customerAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          zip
          country
          phone
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
        id: addressId,
        address: {
          ...address,
          phone: address.phone || ''
        }
      }
    });

    if (data.data.customerAddressUpdate.customerUserErrors.length > 0) {
      throw new Error(data.data.customerAddressUpdate.customerUserErrors[0].message);
    }

    return data.data.customerAddressUpdate.customerAddress;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
}

/**
 * Delete Customer Address
 */
export async function deleteCustomerAddress(accessToken: string, addressId: string) {
  const mutation = `
    mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
      customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
        deletedCustomerAddressId
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
        id: addressId
      }
    });

    if (data.data.customerAddressDelete.customerUserErrors.length > 0) {
      throw new Error(data.data.customerAddressDelete.customerUserErrors[0].message);
    }

    return true;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
}

/**
 * Set Default Address
 */
export async function setDefaultAddress(accessToken: string, addressId: string) {
  const mutation = `
    mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
      customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
        customer {
          id
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
        addressId
      }
    });

    if (data.data.customerDefaultAddressUpdate.customerUserErrors.length > 0) {
      throw new Error(data.data.customerDefaultAddressUpdate.customerUserErrors[0].message);
    }

    return true;
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
}

/**
 * Update Customer Profile
 */
export async function updateCustomerProfile(
  accessToken: string,
  customer: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    acceptsMarketing?: boolean;
  }
) {
  const mutation = `
    mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
        customer {
          id
          firstName
          lastName
          email
          phone
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
        customer
      }
    });

    if (data.data.customerUpdate.customerUserErrors.length > 0) {
      throw new Error(data.data.customerUpdate.customerUserErrors[0].message);
    }

    return data.data.customerUpdate.customer;
  } catch (error) {
    console.error('Error updating customer profile:', error);
    throw error;
  }
}

/**
 * Format Order Data
 */
function formatOrder(order: any) {
  const status = determineOrderStatus(order.fulfillmentStatus, order.financialStatus);

  return {
    id: order.name,
    orderNumber: order.orderNumber,
    date: new Date(order.processedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    total: `$${parseFloat(order.totalPrice.amount).toFixed(2)}`,
    totalAmount: parseFloat(order.totalPrice.amount),
    subtotal: parseFloat(order.subtotalPrice.amount),
    shipping: parseFloat(order.totalShippingPrice.amount),
    tax: parseFloat(order.totalTax.amount),
    status: status,
    financialStatus: order.financialStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    shippingAddress: order.shippingAddress,
    items: order.lineItems.edges.map(({ node }: any) => ({
      title: node.title,
      quantity: node.quantity,
      price: parseFloat(node.variant.price.amount),
      image: node.variant.image?.url || '/images/placeholder.webp',
      handle: node.variant.product.handle,
      variantTitle: node.variant.title
    })),
    itemsText: order.lineItems.edges
      .map(({ node }: any) => `${node.title}${node.quantity > 1 ? ` (×${node.quantity})` : ''}`)
      .join(', ')
  };
}

/**
 * Determine Order Status
 */
function determineOrderStatus(fulfillmentStatus: string, financialStatus: string): string {
  if (fulfillmentStatus === 'FULFILLED') {
    return 'Delivered';
  }
  if (fulfillmentStatus === 'PARTIAL') {
    return 'Partially Shipped';
  }
  if (fulfillmentStatus === 'IN_TRANSIT') {
    return 'In Transit';
  }
  if (fulfillmentStatus === 'UNFULFILLED') {
    if (financialStatus === 'PAID') {
      return 'Processing';
    }
    if (financialStatus === 'PENDING') {
      return 'Payment Pending';
    }
  }
  if (financialStatus === 'REFUNDED') {
    return 'Refunded';
  }
  if (financialStatus === 'PARTIALLY_REFUNDED') {
    return 'Partially Refunded';
  }

  return 'Processing';
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
 * Customer Signup/Registration
 */
export async function customerCreate(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string
) {
  const mutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
          phone
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const input: any = {
    email,
    password,
    firstName,
    lastName,
    acceptsMarketing: false
  };

  // Add phone if provided (must be in E.164 format: +1XXXXXXXXXX)
  if (phone) {
    input.phone = phone;
  }

  const data = await shopifyFetch({
    query: mutation,
    variables: { input }
  });

  return data.data.customerCreate;
}


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
        phone
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
      phone: customer.phone || '',
      name: `${customer.firstName} ${customer.lastName}`,
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