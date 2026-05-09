import Property from "../models/propertyModel.js";

// ================= ADD PROPERTY =================
export const addProperty = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (user.role !== "admin" && user.role !== "agent") {
  return res.status(403).json({ error: "Access denied" });
}

    const {
      title,
      type,
      city,
      price,
      image,
      floor,
      features,
      description,
      amenities,
      property_status,
      status
    } = req.body;

    const property = await Property.create({
      agent_id: user.id,
      title,
      type,
      city,
      price,
      image,
      floor,
      features,
      description,
      amenities,
      property_status,
      status
    });

    res.status(201).json({
      message: "Property added successfully",
      property
    });
  } catch (error) {
    console.error("ADD PROPERTY ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================= GET ALL PROPERTIES =================
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.findAll();
    res.status(200).json(properties);
  } catch (error) {
    console.error("GET PROPERTIES ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================= GET AGENT PROPERTIES =================
export const getAgentProperties = async (req, res) => {
  try {
    const agentId = req.user.id;

    const properties = await Property.findAll({
      where: { agent_id: agentId }
    });

    res.status(200).json({ properties });
  } catch (error) {
    console.error("GET AGENT PROPERTIES ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================= UPDATE PROPERTY (AGENT) =================
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findOne({
      where: {
        id,
        agent_id: req.user.id
      }
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const {
      title,
      type,
      city,
      price,
      image,
      floor,
      features,
      description,
      amenities,
      property_status
    } = req.body;

    property.title = title ?? property.title;
    property.type = type ?? property.type;
    property.city = city ?? property.city;
    property.price = price ?? property.price;
    property.image = image ?? property.image;
    property.floor = floor ?? property.floor;
    property.features = features ?? property.features;
    property.description = description ?? property.description;
    property.amenities = amenities ?? property.amenities;
    property.property_status = property_status ?? property.property_status;

    await property.save();

    res.status(200).json({
      message: "Property updated successfully",
      property
    });
  } catch (error) {
    console.error("UPDATE PROPERTY ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================= REQUEST DELETE PROPERTY (AGENT) =================
export const requestDeleteProperty = async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        agent_id: req.user.id
      }
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    property.status = "inactive";
    await property.save();

    res.json({ message: "Delete request sent to admin" });
  } catch (error) {
    console.error("REQUEST DELETE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================= DELETE PROPERTY (ADMIN) =================
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    await property.destroy();
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("DELETE PROPERTY ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};




// ================= GET PROPERTY BY ID =================
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("GET PROPERTY BY ID ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};