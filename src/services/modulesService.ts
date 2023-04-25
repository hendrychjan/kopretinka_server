import Joi, { ValidationError } from "joi";
import { PrismaClient, Port, Module } from "@prisma/client";
import { parseToServiceError } from "../misc/serviceError";
import _ from "lodash";
const prisma = new PrismaClient();

// model Module {
//   id          String @id @default(auto()) @map("_id") @db.ObjectId
//   productCode String
//   ports       Port[]
// }

export default class ModulesService {
  static validateModule(port: Port): ValidationError | undefined {
    const schema = Joi.object({
      id: Joi.string(),
      productCode: Joi.string().required(),
      ports: Joi.any(),
    });

    return schema.validate(port).error;
  }

  static async getByProductCode(productCode: string, populatePorts = false): Promise<Module> {
    try {
      const module = await prisma.module.findUniqueOrThrow({
        where: {
          productCode: productCode,
        },
        include: {
          ports: populatePorts,
        },
      });
      return module;
    } catch (e) {
      throw parseToServiceError(e, "Module");
    }
  }

  static async register(module: Port): Promise<Module> {
    try {
      const newModule = await prisma.module.create({
        data: _.pick(module, ["productCode"]) as Module,
      });
      return newModule;
    } catch (e) {
      throw parseToServiceError(e, "Module");
    }
  }

  static async configure(module: Module): Promise<Module> {
    try {
      const updatedModule = await prisma.module.update({
        where: {
          productCode: module.productCode,
        },
        data: _.pick(module, ["ports"]) as Module,
      });
      return updatedModule;
    } catch (e) {
      throw parseToServiceError(e, "Module");
    }
  }

  static async delete(moduleId: string) : Promise<void> {
    try {
      await prisma.module.delete({
        where: {
          id: moduleId,
        },
      });
    } catch (e) {
      throw parseToServiceError(e, "Module");
    }
  }
}
