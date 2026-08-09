const Item = require("../models/Item");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const addItem = async (req, res) => {
  try {
    const { title, description, category, location, date, status, phone } = req.body;
    let imageUrl = "";

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "lost-and-found", resource_type: "image" },
          (error, result) => error ? reject(error) : resolve(result)
        );
        Readable.from(req.file.buffer).pipe(uploadStream);
      });
      imageUrl = uploadResult.secure_url;
    }

    const item = await Item.create({
      title,
      description,
      category,
      location,
      date,
      status,
      phone,
      image: imageUrl,
      postedBy: req.user.id,
    });

    res.status(201).json({ success: true, message: "Item added successfully", item });
  } catch (error) {
    console.error("Add item error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate("postedBy", "name email");
    res.status(200).json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("postedBy", "name email");

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this item" });
    }

    const { title, description, category, location, date, status, phone } = req.body;
    let imageUrl = item.image;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "lost-and-found", resource_type: "image" },
          (error, result) => error ? reject(error) : resolve(result)
        );
        Readable.from(req.file.buffer).pipe(uploadStream);
      });
      imageUrl = uploadResult.secure_url;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { title, description, category, location, date, status, phone, image: imageUrl },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("Update item error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this item" });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAsReturned = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You are not authorized" });
    }

    if (item.status === "Returned") {
      item.status = item.previousStatus || "Lost";
      item.previousStatus = null;

      await item.save();

      return res.status(200).json({
        success: true,
        message: "Item marked as unreturned",
        item,
      });
    }

    item.previousStatus = item.status;
    item.status = "Returned";

    await item.save();

    res.status(200).json({
      success: true,
      message: "Item marked as returned",
      item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user.id });
    res.status(200).json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems,
  markAsReturned,
};