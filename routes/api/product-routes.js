// Import required modules
const express = require("express");
const router = express.Router();
const db = require("../../models");

// Define routes for the `/api/products` endpoint

// GET all products with associated category and tag data
router.get("/", async (req, res) => {
  try {
    const products = await db.Product.findAll({
      include: [
        { model: db.Category },
        { model: db.Tag },
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});

// GET a single product by ID with associated category and tag data
router.get("/:id", async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id, {
      include: [
        { model: db.Category },
        { model: db.Tag },
      ],
    });
    if (!product) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});

// POST a new product
router.post("/", async (req, res) => {
  try {
    const product = await db.Product.create(req.body);
    if (req.body.tagIds) {
      const productTags = req.body.tagIds.map(tag_id => ({
        product_id: product.id,
        tag_id,
      }));
      await db.ProductTag.bulkCreate(productTags);
    }
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: "Failed to create product" });
  }
});

// PUT update a product by ID with associated category and tag data
router.put("/:id", async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
    } else {
      await product.update(req.body);
      if (req.body.tagIds) {
        const productTags = req.body.tagIds.map(tag_id => ({
          product_id: product.id,
          tag_id,
        }));
        await db.ProductTag.destroy({ where: { product_id: product.id } });
        await db.ProductTag.bulkCreate(productTags);
      }
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update product" });
  }
});

// DELETE a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
    } else {
      await product.destroy();
      res.status(200).json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
