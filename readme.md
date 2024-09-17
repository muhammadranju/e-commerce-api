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

# All routes in this project

## Public routes

### auth routes

- /api/v1/auth/login - post // login
- /api/v1/auth/register - post // register
- /api/v1/auth/forgot-password - post // forgot password
- /api/v1/auth/reset-password - post // reset password
- /api/v1/auth/verify-email - post // verify email

### product routes

- /api/v1/products/id - get // get product

### brands routes

- /api/v1/brands - get // get brands
- /api/v1/brands/id - get // get brand by id

### categories routes

- /api/v1/categories - get // get categories
- /api/v1/categories/id - get // get category by id

### seller routes

- /api/v1/seller/stores/id - get // get store

## private routes

### users routes

- /api/v1/users/profile - get // get profile
- /api/v1/users/profile - patch // update profile
- /api/v1/user/change-password - patch // change password
- /api/v1//users/profile/addresses - get // get addresses
- /api/v1/users/profile/addresses - post // add address
- /api/v1/users/profile/addresses/id - patch // update address by id
- /api/v1/users/profile/addresses/id - delete // delete address by id

### brands routes

- /api/v1/brands - post // add brand
- /api/v1/brands/id - patch // update brand by id
- /api/v1/brands/id - delete // delete brand by id

### categories routes

- /api/v1/categories - post // add category
- /api/v1/categories/id - patch // update category by id
- /api/v1/categories/id - delete // delete category by id

### products routes

- /api/v1/products - post // add product
- /api/v1/products/id - patch // update product by id
- /api/v1/products/id - delete // delete product by id

### cart routes

- /api/v1/carts - get // get carts
- /api/v1/carts - post // add to cart
- /api/v1/carts/id - patch // update cart by id
- /api/v1/carts/id - delete // delete cart by id
- /api/v1/carts/empty - delete // delete all carts

## orders routes

- /api/v1/orders - get // get orders
- /api/v1/orders/id - get // get orders by id
- /api/v1/orders/tracking/id - get // get order tracking by id
- /api/v1/orders/ - post // add order
- /api/v1/orders/id - patch // update order by id
- /api/v1/orders/id - delete // delete order by id

### payment routes

- /api/v1/payments/history - get // get payment history
- /api/v1/payments/id - get // get payment by id
- /api/v1/payments/success - post // success payment

### delivery routes !TODO

- /api/v1/deliveries/id - get // get delivery by id
- /api/v1/deliveries/id - patch // update delivery by id
- /api/v1/deliveries/id - delete // delete delivery by id
- /api/v1/deliveries/tracking/id - get // get delivery tracking by id
- /api/v1/deliveries/history - get // get delivery history
- /api/v1/deliveries/success - post // success delivery
- /api/v1/deliveries/cancel - post // cancel delivery
- /api/v1/deliveries/cancel/id - delete // cancel delivery by id

### review routes

- /api/v1/reviews - post // get review by id
- /api/v1/users/reviews - patch // get review by id

### wishlist routes

- /api/v1/wishlists - get // get wishlists
- /api/v1/wishlists/id - delete // delete wishlist by id
- /api/v1/wishlists - post // add product to wishlist

### seller routes

- /api/v1/seller/auth/login - post // login
- /api/v1/seller/auth/register - post // register
- /api/v1/seller/auth/forgot-password - post // forgot password
- /api/v1/seller/auth/reset-password - patch // reset password
- /api/v1/seller/auth/verify-email - post // verify email
- /api/v1/seller/auth/change-password - patch // change password

### seller profile routes

- /api/v1/seller/profile - get // get seller profile
- /api/v1/seller/profile/id - get // get seller profile by id
- /api/v1/seller/profile - patch // update seller profile

### seller store routes

- /api/v1/seller/stores/id - get // get store by id
- /api/v1/seller/stores - get // get stores !TODO
- /api/v1/seller/stores/id - patch // update store by id
- /api/v1/seller/stores/id - delete // delete store by id
- /api/v1/seller/stores - post // add store

### seller product routes

- /api/v1/seller/products - get // get all products
- /api/v1/seller/products/id - get // get product by id
- /api/v1/seller/products/id - patch // update product by id
- /api/v1/seller/products/id - delete // delete product by id
- /api/v1/seller/products - post // add product

### admin auth routes

- /api/v1/admins/auth/login - post // login
- /api/v1/admins/auth/register - post // register
- /api/v1/admins/auth/forgot-password - post // forgot password
- /api/v1/admins/auth/reset-password - patch // reset password
- /api/v1/admins/auth/change-password - patch // change password
-

### admin profile routes // !TODO

- /api/v1/admins/profile - get // get admin profile
- /api/v1/admins/profile/id - get // get admin profile by id
- /api/v1/admins/profile - patch // update admin profile
- /api/v1/admins/profile/id - delete // delete admin profile by id
- /api/v1/admins/profile - post // add admin profile

### seller product routes by admin

- /api/v1/admins/sellers/:seller_id/products - get // get all products
- /api/v1/admins/sellers/:seller_id/products/:product_id - get // get product by id
- /api/v1/admins/sellers/:seller_id/products - post // add product
- /api/v1/admins/sellers/:seller_id/products/:product_id - patch // update product by id
- /api/v1/admins/sellers/:seller_id/products/:product_id - delete // delete product by id

### seller order routes by admin

- /api/v1/admins/admins/orders?type= - get // get all orders
- /api/v1/admins/admins/orders/:order_id - get // get order by id
- /api/v1/admins/admins/orders/:order_id - patch // update order by id

### seller account details routes by admin

- /api/v1//admins/seller/profile - get // get account all details
- /api/v1/admins/seller/profile/id - get // get account by id
- /api/v1/admins/seller/profile - patch // update account by id
- /api/v1/admins/seller/profile/id - delete // delete account by id !TODO
- /api/v1/admins/seller/profile - post // add account

### seller store routes by admin\

- /api/v1/admins/sellers/seller_id/ - get // get store by id
- /api/v1/admins/sellers/seller_id/ - patch // update store by id
- /api/v1/admins/sellers/seller_id/ - delete // delete store by id !TODO
- /api/v1/admins/sellers/seller_id/ - post // add store !TODO

### user routes by admin

- /api/v1/admins/users/user_id - get // get user profile
- /api/v1/admins/users/user_id - patch // update user profile
- /api/v1/admins/users/user_id - delete // delete user profile !TODO
- /api/v1/admins/users/user_id - post // add user profile !TODO

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

`ACCESS_TOKEN_SECRET` "**\*\***\*\***\*\***\*\*\***\*\***\*\***\*\***"

`ACCESS_TOKEN_EXPIRY` "**\*\***\*\***\*\***\*\*\***\*\***\*\***\*\***"

`REFRESH_TOKEN_SECRET` "**\*\***\*\***\*\***\*\*\***\*\***\*\***\*\***"

`REFRESH_TOKEN_EXPIRY` "**\*\***\*\***\*\***\*\*\***\*\***\*\***\*\***"

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
