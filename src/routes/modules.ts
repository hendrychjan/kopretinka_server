// Manage module boards
import express, { Request, Response } from "express";
import { adminAuth } from "../middleware/adminAuth";
import ModulesService from "../services/modulesService";
import { productCode } from "../middleware/productCode";
import Joi from "joi";
import PortsService from "../services/portsService";

const router = express.Router();

// Register a new module
router.post("/register", adminAuth, async (req: Request, res: Response) => {
  const error = ModulesService.validateModule(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  try {
    const module = await ModulesService.register(req.body);
    res.status(201).send(module);
  } catch (e: any) {
    res
      .status(e["httpCode"] || 500)
      .send(e["message"] || "Internal server error");
  }
});

// Get the module configuration
router.get("/config", productCode, async (req: Request, res: Response) => {
  // Extract the product code from the header and get the module
  const moduleCode = req.headers["product-code"] as string;
  const module = await ModulesService.getByProductCode(moduleCode, true);
  if (module == null) {
    res.status(404).send("Module not found");
    return;
  }

  // Send the module
  res.status(200).send(module);
});

// Initialize specified ports for a module
router.post("/config", productCode, async (req: Request, res: Response) => {
  // Validate the body
  const schema = Joi.object({
    ports: Joi.array().items(Joi.number().min(0).max(15)).unique().required(),
  });
  const error = schema.validate(req.body).error;
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // Extract the product code from the header and get the module
  const moduleCode = req.headers["product-code"] as string;
  let module = await ModulesService.getByProductCode(moduleCode);
  if (!module) {
    res.status(400).send("Module not found");
    return;
  }

  // Delete the old port configurations
  try {
    await PortsService.deleteByModule(module.id);
  } catch (e: any) {
    res
      .status(e["httpCode"] || 500)
      .send(e["message"] || "Internal server error");
  }

  // Initialize the ports
  try {
    for (const portNumber of req.body.ports) {
      await PortsService.initialize(module.id, portNumber);
    }
  } catch (e: any) {
    res
      .status(e["httpCode"] || 500)
      .send(e["message"] || "Internal server error");
  }

  // Get the updated module
  module = await ModulesService.getByProductCode(moduleCode, true);
  res.status(200).send(module);
});

// Delete a module
router.delete("/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    // Delete the ports
    await PortsService.deleteByModule(req.params.id);

    // Delete the module itself
    await ModulesService.delete(req.params.id);
    res.send("Module deleted");
  } catch (e: any) {
    res
      .status(e["httpCode"] || 500)
      .send(e["message"] || "Internal server error");
  }
});

module.exports = router;
