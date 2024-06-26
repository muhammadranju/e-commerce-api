const ApiVersion = "/api/v1";
const baseURI = `http://localhost:3030${ApiVersion}`;

/**
 * @type {{ ADMIN:"ADMIN", USER:"USER", EDITOR:"EDITOR", MANAGER:"MANAGER" SELLER:"SELLER"} as const}
 */

// User Enums
const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
  EDITOR: "EDITOR",
  MANAGER: "MANAGER",
  SELLER: "SELLER",
};

const AvailableUserRoles = Object.values(UserRolesEnum);

/**
 * @type {{ APPROVED:"APPROVED", PENDING:"PENDING", BLOCK:"BLOCK", DECLINE:"DECLINE" } as const}
 */
const UserStatusEnum = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  BLOCK: "BLOCK",
  DECLINE: "DECLINE",
};

const AvailableUserStatus = Object.values(UserStatusEnum);

/**
 * @type {{ APPROVED:"APPROVED", PENDING:"PENDING", SUSPENDED:"SUSPENDED"} as const}
 */
const UserCommentStatusEnum = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  SUSPENDED: "SUSPENDED",
};
const AvailableCommentStatus = Object.values(UserCommentStatusEnum);

/**
 * @type {{ PENDING: "PENDING"; CANCELLED: "CANCELLED"; DELIVERED: "DELIVERED"; PLACED: "PLACED"; OUT_FOR_DELIVERY: "PROCESSING"; SHIPPED: "SHIPPED"; } as const}
 */

// Order Enums
const OrderStatusEnum = {
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
  DELIVERED: "DELIVERED",
  PLACED: "PLACED",
  OUT_FOR_DELIVERY: "PROCESSING",
  SHIPPED: "SHIPPED",
};
const AvailableOrderStatuses = Object.values(OrderStatusEnum);

/**
 * @type {{ SUCCEEDED: "SUCCEEDED"; UNPAID: "UNPAID"; CANCELLED: "CANCELLED"; FAILED: "FAILED"; REFUNDED: "REFUNDED";STATUS: "VALID"; APIConnect: "DONE"  } as const}
 */

const PaymentStatus = {
  SUCCEEDED: "SUCCEEDED",
  UNPAID: "UNPAID",
  CANCELLED: "CANCELLED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  STATUS: "VALID",
  APIConnect: "DONE",
};
const AvailablePaymentStatus = Object.values(PaymentStatus);

/**
 * @type {{ CREDIT_CARD: "CREDIT_CARD"; DEBIT_CARD: "DEBIT_CARD"; INTERNET_BANKING: "INTERNET_BANKING"; MOBILE_BANKING: "MOBILE_BANKING"; WALLET: "WALLET"; CASH_ON_DELIVERY: "CASH_ON_DELIVERY"; } as const}
 */
const PaymentMethods = {
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  MOBILEBANKING: "MOBILEBANKING",
  INTERNET_BANKING: "INTERNETBANKING",
  WALLET: "WALLET",
  CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
};
const AvailablePaymentMethods = Object.values(PaymentMethods);

/**
 * @type {{ PENDING:"PENDING", PUBLISHED:"PUBLISHED", DRAFT:"DRAFT" } as const}
 */
// Post Enums
const PostStatusEnum = {
  PENDING: "PENDING",
  PUBLISHED: "PUBLISHED",
  DRAFT: "DRAFT",
};
const AvailablePostStatus = Object.values(PostStatusEnum);

/**
 * @type {{ GOOGLE: "GOOGLE"; GITHUB: "GITHUB"; EMAIL_PASSWORD: "EMAIL_PASSWORD"} as const}
 */
const UserLoginType = {
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
};
const AvailableSocialLogins = Object.values(UserLoginType);

/**
 * @type {{ User:"User"; Product:"Product"; Reviews:"Reviews"; Order:"Order"; Seller:"Seller";  Store: "Store"; Payment:"Payment"; Category:"Category"; Cart:"Cart"; Wishlist:"Wishlist"; Brand:"Brand"; Address:"Address"; OrdersItem:"OrdersItem";} as const}
 */
// Model References
const ModelRefNames = {
  User: "User",
  Product: "Product",
  Reviews: "Reviews",
  Order: "Order",
  Seller: "Seller",
  Store: "Store",
  Payment: "Payment",
  Category: "Category",
  Cart: "Cart",
  Wishlist: "Wishlist",
  Brand: "Brand",
  Address: "Address",
  OrdersItem: "OrdersItem",
};

/**
 * @type {{ VERIFY:true, UNVERIFIED:false, } as const}
 */
const VerifyStatus = {
  VERIFY: true,
  UNVERIFIED: false,
};

const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
};

// Constants
const DATABASE_NAME = "e-commerce-api";
const DATABASE_QUERY = "?retryWrites=true&w=majority";

module.exports = {
  UserRolesEnum,
  AvailableUserRoles,
  UserStatusEnum,
  AvailableUserStatus,
  UserCommentStatusEnum,
  AvailableCommentStatus,
  PostStatusEnum,
  AvailablePostStatus,
  ModelRefNames,
  AvailableSocialLogins,
  UserLoginType,
  VerifyStatus,
  DATABASE_NAME,
  DATABASE_QUERY,
  ApiVersion,
  Gender,
  AvailableOrderStatuses,
  OrderStatusEnum,
  AvailablePaymentMethods,
  PaymentMethods,
  AvailablePaymentStatus,
  PaymentStatus,
  baseURI,
};
