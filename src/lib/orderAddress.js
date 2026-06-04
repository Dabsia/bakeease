/**
 * Normalizes delivery address from order API responses (flat or nested customer).
 */
export function getOrderDeliveryInfo(order) {
  if (!order) return null;

  const c = order.customer;

  const street =
    order.shipping_address ||
    order.streetAddress ||
    c?.streetAddress ||
    c?.shipping_address ||
    c?.address ||
    "";

  const city = order.city || c?.city || "";
  const state = order.state || c?.state || c?.region || "";
  const zip =
    order.zip_code ||
    order.postcode ||
    c?.postcode ||
    c?.zip_code ||
    c?.zipCode ||
    "";
  const country = order.country || c?.country || "";

  const firstName = order.firstName || c?.firstName || "";
  const lastName = order.lastName || c?.lastName || "";
  const name =
    [firstName, lastName].filter(Boolean).join(" ") ||
    order.customer_name ||
    c?.name ||
    "";

  const phone = order.phone || c?.phone || "";
  const email = order.email || c?.email || "";
  const notes =
    order.additionalInfo ||
    order.notes ||
    c?.additionalInfo ||
    c?.notes ||
    "";

  if (!street && !city && !zip) return null;

  const parts = [street, city, state, zip, country].filter(Boolean);
  const formatted = parts.join(", ");

  return {
    name,
    street,
    city,
    state,
    zip,
    country,
    phone,
    email,
    notes,
    formatted,
    short: [street, city].filter(Boolean).join(", "),
  };
}
