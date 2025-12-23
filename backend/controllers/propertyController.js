import { Property } from "../models/propertyModel.js";

// GET all properties
export const getProperties = async (req, res) => {
  try {
    const type = req.query.type; // buy/sell/rent
    const properties = await Property.findAll(type ? { where: { type } } : {});
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST a new property
export const addProperty = async (req, res) => {
  try {
    const newProperty = await Property.create(req.body);
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
