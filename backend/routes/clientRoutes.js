// Client routes placeholder
const express = require("express");
const router = express.Router();

const clientController = require("../controllers/clients/clientController");

// GET all clients
router.get("/", clientController.getAllClients);

// GET client by ID
router.get("/:id", clientController.getClientById);

// POST create client
router.post("/", clientController.createClient);

// PUT update client
router.put("/:id", clientController.updateClient);

// DELETE client
router.delete("/:id", clientController.deleteClient);

module.exports = router;