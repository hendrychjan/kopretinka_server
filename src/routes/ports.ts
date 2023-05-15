// Manage module boards
import express, { Request, Response } from "express";
import ModulesService from "../services/modulesService";
import { productCode } from "../middleware/productCode";
import PortsService from "../services/portsService";

const router = express.Router();

// Get the port configuration
router.get("/:number", productCode, async (req: Request, res: Response) => {
  // Extract the product code from the header and get the module
  const moduleCode = req.headers["product-code"] as string;
  const module = await ModulesService.getByProductCode(moduleCode, true);
  if (module == null) {
    res.status(404).send("Module not found");
    return;
  }

  try {
    const port = await PortsService.getByModule(
      module.id,
      parseInt(req.params.number)
    );
    res.status(200).send(port);
  } catch (e: any) {
    res
      .status(e["httpCode"] || 500)
      .send(e["message"] || "Internal server error");
  }
});

router.post(
  "/:number/update",
  productCode,
  async (req: Request, res: Response) => {
    // Extract the product code from the header and get the module
    const moduleCode = req.headers["product-code"] as string;
    let module = await ModulesService.getByProductCode(moduleCode);
    if (!module) {
      res.status(400).send("Module not found");
      return;
    }

    // Update the module
    try {
      await PortsService.updateValue(
        module.id,
        parseInt(req.params.number),
        parseInt(req.body.value)
      );
      res.status(200).send("OK");
    } catch (e: any) {
      res
        .status(e["httpCode"] || 500)
        .send(e["message"] || "Internal server error");
    }
  }
);

// Change the port configuration
router.put("/:number", productCode, async (req: Request, res: Response) => {
  // Validate the body
  const error = PortsService.validatePort(req.body);
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

  // Update the module
  await PortsService.configure(
    module.id,
    parseInt(req.params.number),
    req.body
  );
  const port = await PortsService.getByModule(
    moduleCode,
    parseInt(req.params.number)
  );

  res.status(200).send(port);
});

module.exports = router;
