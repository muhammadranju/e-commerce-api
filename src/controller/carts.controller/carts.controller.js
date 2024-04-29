const Cart = require("../../models/Cart.model/Cart.model");
/**
 * Retrieves a cart by its ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the cart to retrieve.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the request has been handled.
 */
const getCart = async (req, res) => {
  try {
    // Find a cart by its ID
    const cart = await Cart.findById(req.params.id);

    // If no cart is found, return a 404 error
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Return the retrieved cart
    res.json(cart);
  } catch (err) {
    // Log and return any errors that occur
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * Creates a new cart.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The data to create a new cart.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the request has been handled.
 */
const createCart = async (req, res) => {
  try {
    // Instantiate a new Cart object using the data from the request body
    const cart = new Cart(req.body);

    // Save the cart to the database and retrieve the saved document
    const savedCart = await cart.save();

    // Return a 201 status code with the saved cart in the response body
    res.status(201).json(savedCart);
  } catch (err) {
    // Log and return any errors that occur
    console.error(err);

    // Return a 500 status code with a generic server error message
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Updates a cart.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the cart to update.
 * @param {Object} req.body - The data to update the cart with.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the request has been handled.
 */
const updateCart = async (req, res) => {
  try {
    // Find a cart by its ID and update it with the data from the request body,
    // return the updated cart document
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document instead of the original
    });

    // If no cart is found, return a 404 error
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Return the updated cart in the response body
    res.json(cart);
  } catch (err) {
    // Log and return any errors that occur
    console.error(err);

    // Return a 500 status code with a generic server error message
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Deletes a cart.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the cart to delete.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the request has been handled.
 */
const deleteCart = async (req, res) => {
  try {
    // Find a cart by its ID and delete it
    const cart = await Cart.findByIdAndDelete(req.params.id);

    // If no cart is found, return a 404 error
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Return a success message in the response body
    res.json({ message: "Cart deleted" });
  } catch (err) {
    // Log and return any errors that occur
    console.error(err);

    // Return a 500 status code with a generic server error message
    res.status(500).json({ message: "Server error" });
  }
};
