const Wishlist = require("../../models/Wishlist.model/Wishlist.model");

const getWishlist = async (req, res) => {
  try {
    const wishlists = await Wishlist.find();
    res.json(wishlists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const createWishlist = async (req, res) => {
  const wishlist = new Wishlist({
    name: req.body.name,
    items: req.body.items,
  });

  try {
    const newWishlist = await wishlist.save();
    res.status(201).json(newWishlist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const updateWishlist = async (req, res) => {
  try {
    const updatedWishlist = await Wishlist.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        items: req.body.items,
      },
      { new: true }
    );
    res.json(updatedWishlist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const deleteWishlist = async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Wishlist deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createWishlist,
  getWishlist,
  updateWishlist,
  deleteWishlist,
};
