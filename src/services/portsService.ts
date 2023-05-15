import Joi, { ValidationError } from "joi";
import { PrismaClient, Port } from "@prisma/client";
import { parseToServiceError } from "../misc/serviceError";
import _ from "lodash";
const prisma = new PrismaClient();

export default class PortsService {
  static validatePort(port: Port): ValidationError | undefined {
    const schema = Joi.object({
      id: Joi.string(),
      number: Joi.number().min(0).max(15),
      lastValue: Joi.number().min(0).max(100),
      lastUpdate: Joi.date().iso(),
      log: Joi.any(),
      module: Joi.any(),
      moduleId: Joi.string(),
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

  static async getByModule(
    moduleId: string,
    portNumber: number
  ): Promise<Port> {
    try {
      const port = await prisma.port.findFirstOrThrow({
        where: {
          moduleId: moduleId,
          number: portNumber,
        },
      });
      return port;
    } catch (e) {
      throw parseToServiceError(e, "Port");
    }
  }

  static async initialize(moduleId: string, portNumber: number): Promise<Port> {
    try {
      const newPort = await prisma.port.create({
        data: {
          number: portNumber,
          module: {
            connect: {
              id: moduleId,
            },
          },
        },
      });
      return newPort;
    } catch (e) {
      throw parseToServiceError(e, "Port");
    }
  }

  static async configure(moduleId: string, portNumber: number, config: Port): Promise<void> {
    try {
      await prisma.port.updateMany({
        data: _.pick(config, []) as Port,
        where: {
          moduleId: moduleId,
          number: portNumber,
        },
      });
    } catch (e) {
      throw parseToServiceError(e, "Port");
    }
  }

  static async updateValue(moduleId: string, portNumber: number, value: number): Promise<void> {
    try {
      await prisma.port.updateMany({
        data: {
          lastValue: value,
          lastUpdate: new Date().toISOString(),
        },
        where: {
          moduleId: moduleId,
          number: portNumber,
        },
      });
    } catch (e) {
      throw parseToServiceError(e, "Port");
    }
  }

  static async delete(portId: string): Promise<void> {
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
}
