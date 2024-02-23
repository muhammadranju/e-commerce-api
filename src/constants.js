const ApiVersion = "/api/v1";

/**
 * @type {{ ADMIN:"ADMIN", USER:"USER", EDITOR:"EDITOR", MANAGER:"MANAGER" } as const}
 */
const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
  EDITOR: "EDITOR",
  MANAGER: "MANAGER",
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
 * @type {{ PENDING: "PENDING"; CANCELLED: "CANCELLED"; DELIVERED: "DELIVERED"; } as const}
 */
const OrderStatusEnum = {
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
  DELIVERED: "DELIVERED",
};
const AvailableOrderStatuses = Object.values(OrderStatusEnum);

/**
 * @type {{ SUCCEEDED: "SUCCEEDED"; PENDING: "PENDING"; CANCELLED: "CANCELLED"; FAILED: "FAILED"; REFUNDED: "REFUNDED" } as const}
 */

const PaymentStatus = {
  SUCCEEDED: "SUCCEEDED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};
const AvailablePaymentStatus = Object.values(PaymentStatus);

/**
 * @type {{ CREDIT_CARD: "CREDIT_CARD"; DEBIT_CARD: "DEBIT_CARD"; NET_BANKING : "NET_BANKING "; WALLET: "WALLET"; CASH_ON_DELIVERY: "CASH_ON_DELIVERY"; } as const}
 */
const PaymentMethods = {
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  NET_BANKING: "NET_BANKING",
  WALLET: "WALLET",
  FAILED: "FAILED",
  CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
};
const AvailablePaymentMethods = Object.values(PaymentMethods);

/**
 * @type {{ PENDING:"PENDING", PUBLISHED:"PUBLISHED", DRAFT:"DRAFT" } as const}
 */
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
 * @type {{ User:"User"; Product:"Product"; Comment:"Comment"; Order:"Order"; Seller:"Seller"; Payment:"Payment"; Category:"Category"; Cart:"Cart"; Wishlist:"Wishlist"; Brand:"Brand"; Address:"Address"; OrdersItem:"OrdersItem";} as const}
 */
const ModelRefNames = {
  User: "User",
  Product: "Product",
  Comment: "Comment",
  Order: "Order",
  Seller: "Seller",
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
const DATABASE_NAME = "e-commerce-api";
const DATABASE_QUERY = "?retryWrites=true&w=majority";

const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
};

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
};
