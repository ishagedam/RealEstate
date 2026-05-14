
import Property from "../models/propertyModel.js";
import User from "../models/userModel.js"; 
import express from "express";
import authMiddleware from "../authMiddleware.js";
const router = express.Router();
import { addProperty } from "../controllers/propertyController.js";
import Enquiry from "../models/enquiryModel.js"; 

router.post(
  "/agent/property",
  authMiddleware("agent"),
  addProperty
);



// ===================== ADMIN ROUTES ===================== //
router.get("/users", authMiddleware("admin"), async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["id","name","email","role"] });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// APPROVE USER AS AGENT
router.post("/approve-agent", authMiddleware("admin"), async (req, res) => {
  try {
    const { userIdToApprove } = req.body;

    if (!userIdToApprove) {
      return res.status(400).json({ message: "User ID required" });
    }

    const user = await User.findByPk(userIdToApprove);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "agent";
    await user.save();

    res.json({ message: "User approved as agent", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== VIEW ALL USERS (ADMIN) =====================
router.get("/users", authMiddleware("admin"), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role"]
    });

    res.json({ users });
  } catch (err) {
    console.error("Fetch Users Error:", err);
    res.status(500).json({ error: err.message });
  }
});




// ================= DELETE AGENT PERMANENTLY =================
router.post("/block-agent", authMiddleware("admin"), async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await user.destroy({ alter: true }); 

        res.json({ 
            success: true, 
            message: "Agent deleted permanently from database! ✅" 
        });

    } catch (err) {
        console.error("Backend Error:", err.message);
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
});



router.get("/", authMiddleware("admin"), async (req,res)=>{
    try{
        const properties = await Property.findAll();
        res.json(properties);
    } catch(err){
        res.status(500).json({ error: err.message });
    }
});


router.post("/admin/property", authMiddleware("admin"), async (req, res) => {
  try {
    const newProperty = await Property.create({
      ...req.body,
      agent_id: req.user.id   
    });

    res.status(201).json(newProperty);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to add property",
      error: err.message
    });
  }
});




// ====================== ADMIN: UPDATE PROPERTY ======================
router.put(
  "/admin/property/:id",
  authMiddleware("admin"),
  async (req, res) => {
    try {
      const property = await Property.findByPk(req.params.id);
      if (!property) return res.status(404).json({ message: "Property not found" });

      await property.update(req.body);
      res.json({ message: "Property updated", property });
    } catch (err) {
      res.status(500).json({ message: "Failed to update property", error: err.message });
    }
  }
);

// ====================== ADMIN: DELETE PROPERTY ======================
router.delete(
  "/admin/property/:id",
  authMiddleware("admin"),
  async (req, res) => {
    try {
      const property = await Property.findByPk(req.params.id);
      if (!property) return res.status(404).json({ message: "Property not found" });

      await property.destroy();
      res.json({ message: "Property deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete property", error: err.message });
    }
  }
);

//specific agent property

router.get("/admin/agent/:agentId/properties", authMiddleware("admin"), async (req, res) => {
    try {
        const { agentId } = req.params;

        const properties = await Property.findAll({ 
            where: { 
                agent_id: agentId //
            },
            order: [['createdAt', 'DESC']]
        });

        if (!properties || properties.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "This agent has not added any properties yet." 
            });
        }

        res.json({ success: true, properties });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});



router.get("/admin/enquiries/all-agents", authMiddleware("admin"), async (req, res) => {
    try {
        const enquiries = await Enquiry.findAll({ order: [['createdAt', 'DESC']] });
        res.json(enquiries);
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ error: err.message });
    }
});




router.post("/admin/enquiries/action", authMiddleware("admin"), async (req, res) => {
    try {
        const { mobile, email, action } = req.body;
        const [updatedRows] = await Enquiry.update(
            { status: action || "Contacted" }, 
            { 
                where: { 
                    [Op.or]: [
                        { mobile: mobile || "N/A" },
                        { email: email || "N/A" }
                    ]
                } 
            }
        );
        if (updatedRows === 0) return res.status(404).json({ error: "Enquiry not found" });
        res.json({ message: "Status updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/admin/enquiries/my-properties", authMiddleware("admin"), async (req, res) => {
    try {
   
        const adminId = req.user ? req.user.id : req.adminId; 

        if (!adminId) {
            return res.status(401).json({ error: "Admin ID not found in token" });
        }

        const myProperties = await Property.findAll({
            where: { agent_id: adminId }, 
            attributes: ['id'],
            raw: true
        });

      
        if (!myProperties || myProperties.length === 0) {
            return res.json([]);
        }

   
        const propertyIds = myProperties.map(p => p.id);

        const enquiries = await Enquiry.findAll({
            where: { 
                property_id: propertyIds 
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(enquiries); 

    } catch (err) {
        console.error("Backend Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});



//===============================================================================================================
router.put("/admin/profile/update", authMiddleware, async (req, res) => {
    try {
        const { name, mobile } = req.body;
        const adminId = req.user.id;

     
        console.log("Request received for ID:", adminId, "Data:", name, mobile);

      
        await User.update(
            { name, mobile }, 
            { where: { id: adminId } }
        );

        return res.status(200).json({ 
            success: true, 
            message: "Profile Updated Successfully" 
        });

    } catch (err) {
        console.error("Update Error:", err);
       
        return res.status(500).json({ 
            success: false, 
            error: err.message 
        });
    }
});


//************************************************************************************************************************************* */
// ================================================================ AGENT ROUTES =========================================================================== //

// Add property

router.post(
  "/agent/property",
  authMiddleware("agent"),
  async (req, res) => {
    try {
      console.log("ADD PROPERTY ROUTE HIT");
      console.log("USER:", req.user);
      console.log("BODY:", req.body);

      const agentId = req.user.id;

      // create property
      const property = await Property.create({
        ...req.body,
        agentId
      });

      res.json({
        message: "Property added successfully",
        property
      });
    } catch (err) {
      console.error("ADD PROPERTY ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);




router.put("/agent/property/:id", authMiddleware("agent"), async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    await property.update(req.body);
    res.json({ message: "Property updated", property });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete property
router.delete("/agent/property/:id", authMiddleware("agent"), async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    await property.destroy();
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View agent's properties
router.get("/agent/properties/:agentId", authMiddleware("agent"), async (req, res) => {
  try {
    const properties = await Property.findAll({ where: { agentId: req.params.agentId } });
    res.json({ properties });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== USER ROUTES ===================== //

// View all properties
router.get("/properties", authMiddleware("user"), async (req, res) => {
  try {
    const properties = await Property.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({ properties });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post("/admin/approve-agent", authMiddleware("admin"), async (req, res) => 
 {
  try {
    const { userId, agentId, message } = req.body;
    const contact = await Contact.create({ userId, agentId, message });
    res.json({ message: "Message sent to agent", contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET profile by user ID

  router.get("/api/profile/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "role", "mobile"]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});





router.get("/agent/enquiries", authMiddleware("agent"), async (req, res) => {
  try {
    const enquiries = await Enquiry.findAll({
      where: { agent_id: req.user.id }
    });

    res.json(enquiries);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.getAdminProfile = async (req, res) => {
    try {
     
        const propQuery = "SELECT COUNT(*) AS total FROM properties";
        const agentQuery = "SELECT COUNT(*) AS total FROM agents WHERE status = 'pending'";

    
        const [propResult] = await db.execute(propQuery);
        const [agentResult] = await db.execute(agentQuery);

        res.status(200).json({
            success: true,
            user: req.user,   
            stats: {
                totalProperties: propResult[0].total,
                pendingAgents: agentResult[0].total
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Database Error", error: error.message });
    }
};



router.get("/agent/profile", authMiddleware("agent"), async (req, res) => {
    try {
        const agent = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'role', 'profile_pic'] 
        });

        if (!agent) {
            return res.status(404).json({ success: false, message: "Agent not found" });
        }

        res.json(agent);
    } catch (err) {
        console.error("Backend Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});



export default router;



