const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  //   windowMs: 15 * 60 * 1000, // 15 minutes
  windowMs: 1000,
  limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    status: 429,
    message: "To many request from this ip, please try again later",
  },
  // store: ... , // Use an external store for consistency across multiple server instances.
});

module.exports = limiter;
