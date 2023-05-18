const express = require("express");
const router = express.Router();
const models = require("../../models");

router.get("/", async (req, res) => {
  try {
    const tagData = await models.Tag.findAll({
      include: [{ model: models.Product }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tagData = await models.Tag.findByPk(req.params.id, {
      include: [{ model: models.Product }],
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag was found with this id!" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const tagData = await models.Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const tagData = await models.Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (tagData[0] === 0) {
      res.status(404).json({ message: "No tag was found with this id!" });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const tagData = await models.Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag found with this id!" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
