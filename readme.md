# API Design all kinds of info blow here

**This Notion File is all About this project**

### Notion file link: https://muhammadranju.notion.site/e-commerce-api-dca824a1c151425ca3410308b908a3b4?pvs=4

### Diagrams file link: https://app.eraser.io/workspace/Q4vcEg2ZDGZ7Yp9llKrK

### Postman file link: https://www.postman.com/muhammad-ranju/workspace/e-commerce-api/collection/20967644-1055139c-703a-491c-9289-4d2eea04eb1b?action=share&creator=20967644&active-environment=20967644-c215baeb-9397-489b-8de1-943b5424c351

## Features

- User can register/login.
- Seller can register/login also verify his email.
- User can see products and they can order the product.
- User can see her Order status and progress.
- User can do cancel his/hir order.
- User can do reset her passowrd and changer the passowrd.
- User can search product with title or category or tags.
- User can do reviews when hir order is delivered.
- Admin can do add user on dashboard
- Admin can manage user orrders

# Routes

## public routes

### auth routes

- 1.  /api/v1/auth/login - post // login
- 2.  /api/v1/auth/register - post // register
- 3.  /api/v1/auth/forgot-password - post // forgot password
- 4.  /api/v1/auth/reset-password - post // reset password
- 5.  /api/v1/auth/verify-email - post // verify email

### product routes

- 6.  /api/v1/products/id - get // get product

### brands routes

- 7.  /api/v1/brands - get // get brands
- 8.  /api/v1/brands/id - get // get brand by id

### categories routes

- 9.  /api/v1/categories - get // get categories
- 10. /api/v1/categories/id - get // get category by id

### seller routes

- 11. /api/v1/seller/stores/id - get // get store

## private routes

### users routes

- 12. /api/v1/users/profile - get // get profile
- 13. /api/v1/users/profile - patch // update profile
- 14. /api/v1/user/change-password - patch // change password
- 15. /api/v1//users/profile/addresses - get // get addresses
- 16. /api/v1/users/profile/addresses - post // add address
- 17. /api/v1/users/profile/addresses/id - patch // update address by id
- 18. /api/v1/users/profile/addresses/id - delete // delete address by id

### brands routes

- 19. /api/v1/brands - post // add brand
- 20. /api/v1/brands/id - patch // update brand by id
- 21. /api/v1/brands/id - delete // delete brand by id

### categories routes

- 22. /api/v1/categories - post // add category
- 23. /api/v1/categories/id - patch // update category by id
- 24. /api/v1/categories/id - delete // delete category by id

### products routes

- 25. /api/v1/products - post // add product
- 26. /api/v1/products/id - patch // update product by id
- 27. /api/v1/products/id - delete // delete product by id

### cart routes

- 28. /api/v1/carts - get // get carts
- 29. /api/v1/carts - post // add to cart
- 30. /api/v1/carts/id - patch // update cart by id
- 31. /api/v1/carts/id - delete // delete cart by id
- 31. /api/v1/carts/empty - delete // delete all carts

-orders routes

- 32. /api/v1/orders - get // get orders
- 33. /api/v1/orders/id - get // get orders by id
- 34. /api/v1/orders/tracking/id - get // get order tracking by id
- 35. /api/v1/orders/ - post // add order
- 36. /api/v1/orders/id - patch // update order by id
- 37. /api/v1/orders/id - delete // delete order by id

### payment routes

- 38. /api/v1/payments/history - get // get payment history
- 39. /api/v1/payments/id - get // get payment by id
- 40. /api/v1/payments/success - post // success payment

### delivery routes !TODO

- 41. /api/v1/deliveries/id - get // get delivery by id
- 42. /api/v1/deliveries/id - patch // update delivery by id
- 43. /api/v1/deliveries/id - delete // delete delivery by id
- 44. /api/v1/deliveries/tracking/id - get // get delivery tracking by id
- 45. /api/v1/deliveries/history - get // get delivery history
- 46. /api/v1/deliveries/success - post // success delivery
- 47. /api/v1/deliveries/cancel - post // cancel delivery
- 48. /api/v1/deliveries/cancel/id - delete // cancel delivery by id

### review routes

- 49. /api/v1/reviews - post // get review by id
- 50. /api/v1/users/reviews - patch // get review by id

### wishlist routes

- 51. /api/v1/wishlists - get // get wishlists
- 54. /api/v1/wishlists/id - delete // delete wishlist by id
- 55. /api/v1/wishlists - post // add product to wishlist

### seller routes

- 56. /api/v1/seller/auth/login - post // login
- 57. /api/v1/seller/auth/register - post // register
- 58. /api/v1/seller/auth/forgot-password - post // forgot password
- 59. /api/v1/seller/auth/reset-password - patch // reset password
- 60. /api/v1/seller/auth/verify-email - post // verify email
- 61. /api/v1/seller/auth/change-password - patch // change password

### seller profile routes

- 62. /api/v1/seller/profile - get // get seller profile
- 63. /api/v1/seller/profile/id - get // get seller profile by id
- 64. /api/v1/seller/profile - patch // update seller profile

### seller store routes

- 65. /api/v1/seller/stores/id - get // get store by id
- 66. /api/v1/seller/stores - get // get stores !TODO
- 67. /api/v1/seller/stores/id - patch // update store by id
- 68. /api/v1/seller/stores/id - delete // delete store by id
- 69. /api/v1/seller/stores - post // add store

### seller product routes

- 70. /api/v1/seller/products - get // get all products
- 71. /api/v1/seller/products/id - get // get product by id
- 73. /api/v1/seller/products/id - patch // update product by id
- 74. /api/v1/seller/products/id - delete // delete product by id
- 75. /api/v1/seller/products - post // add product

### admin auth routes

- 76. /api/v1/admins/auth/login - post // login
- 77. /api/v1/admins/auth/register - post // register
- 78. /api/v1/admins/auth/forgot-password - post // forgot password
- 79. /api/v1/admins/auth/reset-password - patch // reset password
- 80. /api/v1/admins/auth/change-password - patch // change password
-

### admin profile routes // !TODO

- 81. /api/v1/admins/profile - get // get admin profile
- 82. /api/v1/admins/profile/id - get // get admin profile by id
- 83. /api/v1/admins/profile - patch // update admin profile
- 84. /api/v1/admins/profile/id - delete // delete admin profile by id
- 85. /api/v1/admins/profile - post // add admin profile

### seller product routes by admin

- 86. /api/v1/admins/sellers/:seller_id/products - get // get all products
- 87. /api/v1/admins/sellers/:seller_id/products/:product_id - get // get product by id
- 88. /api/v1/admins/sellers/:seller_id/products - post // add product
- 89. /api/v1/admins/sellers/:seller_id/products/:product_id - patch // update product by id
- 90. /api/v1/admins/sellers/:seller_id/products/:product_id - delete // delete product by id

### seller order routes by admin

- 91. /api/v1/admins/admins/orders?type= - get // get all orders
- 92. /api/v1/admins/admins/orders/:order_id - get // get order by id
- 93. /api/v1/admins/admins/orders/:order_id - patch // update order by id

### seller account details routes by admin

- 94. /api/v1//admins/seller/profile - get // get account all details
- 95. /api/v1/admins/seller/profile/id - get // get account by id
- 96. /api/v1/admins/seller/profile - patch // update account by id
- 97. /api/v1/admins/seller/profile/id - delete // delete account by id !TODO
- 98. /api/v1/admins/seller/profile - post // add account

### seller store routes by admin\

- 99. /api/v1/admins/sellers/seller_id/ - get // get store by id
- 100. /api/v1/admins/sellers/seller_id/ - patch // update store by id
- 101. /api/v1/admins/sellers/seller_id/ - delete // delete store by id !TODO
- 102. /api/v1/admins/sellers/seller_id/ - post // add store !TODO

### user routes by admin

- 103. /api/v1/admins/users/user_id - get // get user profile
- 104. /api/v1/admins/users/user_id - patch // update user profile
- 105. /api/v1/admins/users/user_id - delete // delete user profile !TODO
- 106. /api/v1/admins/users/user_id - post // add user profile !TODO

## Deployment

To develop this project run

```bash
  npm start
  http://localhost:3000/api/v1
```

To deploy this project run

```bash
  npm run dev
  http://localhost:3000/api/v1
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/muhammadranju/e-commerce-api
```

Go to the project directory

```bash
  cd e-commerce-api
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Usage/Examples

```javascript
import Component from "my-project";

function App() {
  return <Component />;
}
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`BASE_URL` "http://localhost:3030"

`PORT` 3030

`MONGODB_URI` "mongodb+srv://<username>:<password>@cluster0.jzvet.mongodb.net/?retryWrites=true&w=majority"

`ACCESS_TOKEN_SECRET` "******\*\*******\*\*\*******\*\*******"

`ACCESS_TOKEN_EXPIRY` "******\*\*******\*\*\*******\*\*******"

`REFRESH_TOKEN_SECRET` "******\*\*******\*\*\*******\*\*******"

`REFRESH_TOKEN_EXPIRY` "******\*\*******\*\*\*******\*\*******"

`EMAIL` "YOUR_EMAIL"

`EMAIL_PASSKEY` "YOUR_EMAIL_PASSKEY"

`EMAIL_SERVICE` "YOUR_EMAIL_SERVICE"

`EMAIL_PORT` "YOUR_EMAIL_PORT"

`EMAIL_USERNAME` "YOUR_EMAIL_USERNAME"

`EMAIL_PASSWORD` "YOUR_EMAIL_PASSWORD"

`CLOUDINARY_CLOUD_NAME` "YOUR_CLOUDINARY_CLOUD_NAME"

`CLOUDINARY_API_KEY` "YOUR_CLOUDINARY_API_KEY"

`CLOUDINARY_API_SECRET` "YOUR_CLOUDINARY_API_SECRET"

## Tech Stack

**Client:** React.js, Next.js, TailwindCSS

**Server:** Node, Express, bcryptjs, cloudinary, compression, cookie-parse, express-rate-limit, jsonwebtoken, mailgen, mongoose, mongoose-aggregate-paginate-v2, nodemailer, socket.io, sslcommerz, stripe

![Logo](https://nodejs.org/static/images/logo.svg)

![Logo](https://www.vectorlogo.zone/logos/expressjs/expressjs-ar21.svg)

## Authors

- [@muhammadranju](https://www.github.com/muhammadranju)

## Feedback

If you have any feedback, please reach out to us at muhamadranju@gmail.com
