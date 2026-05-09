
import Enquiry from "../models/enquiryModel.js";
import Property from "../models/propertyModel.js";


export const getMyPropertyEnquiries = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { agent_id: req.user.id }
    });

    const ids = properties.map(p => p.id);

    const enquiries = await Enquiry.findAll({
      where: { property_id: ids }
    });

    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.findAll();
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByPk(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: "Not found" });
    }

    enquiry.status = req.body.status;
    await enquiry.save();

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};







export const createEnquiry = async (req, res) => {
  try {
    const { propertyId, name, email, mobile, message } = req.body;

  
    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

  
    const enquiry = await Enquiry.create({
      property_id: propertyId,
      agent_id: property.agent_id, 
      name,
      email,
      mobile,
      message
    });

    res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiry
    });

  } catch (err) {
    console.error("ENQUIRY ERROR:", err);
    res.status(500).json({ error: "Server error while creating enquiry" });
  }
};





export const getAgentEnquiries = async (req, res) => {
  try {
    const agentId = req.user.id; 

    const enquiries = await Enquiry.findAll({
      where: { agent_id: agentId },
      order: [["createdAt", "DESC"]]
    });

    res.json(enquiries);

  } catch (err) {
    console.error("AGENT ENQUIRY ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};