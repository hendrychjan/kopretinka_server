import Joi, { ValidationError } from "joi";
import { PrismaClient, Port } from "@prisma/client";
import { parseToServiceError } from "../misc/serviceError";
import _ from "lodash";
const prisma = new PrismaClient();

export default class PortsService {
  static validatePort(port: Port): ValidationError | undefined {
    const schema = Joi.object({
      id: Joi.string(),
      number: Joi.number().min(0).max(15).required(),
      autoWater: Joi.boolean().required(),
      lastWatered: Joi.date(),
      lastValue: Joi.number().min(0).max(100),
      log: Joi.any(),
      module: Joi.any(),
      moduleId: Joi.string().required(),
    });

    return schema.validate(port).error;
  }

  static async getById(id: string): Promise<Port> {
    try {
      const port = await prisma.port.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
      return port;
    } catch (e) {
      throw parseToServiceError(e, "Port");
    }
  }

  static async deleteByModule(moduleId: string): Promise<void> {
    try {
      await prisma.port.deleteMany({
        where: {
          moduleId: moduleId,
        },
      });
    } catch (e) {
      throw parseToServiceError(e, "Port");
    }
  }

  static async initialize(moduleId: string, portNumber: number): Promise<Port> {
    try {
      const newPort = await prisma.port.create({
        data: {
          number: portNumber,
          autoWater: false,
          threshold: 80,
          module: {
            connect: {
              id: moduleId,
            },
          }
        },
      });
      return newPort;
    } catch (e) {
      throw parseToServiceError(e, "Port");
    }
  }

  static async config(port: Port): Promise<Port> {
    try {
      const newPort = await prisma.port.create({
        data: _.pick(port, ["moduleId", "number", "autoWater", "threshold"]) as Port,
      });
      return newPort;
    } catch (e) {
      throw parseToServiceError(e, "Port");
    }
  }

  static async delete(portId: string) : Promise<void> {
    try {
      await prisma.port.delete({
        where: {
          id: portId,
        },
      });
    } catch (e) {
      throw parseToServiceError(e, "Port");
    }
  }
}
