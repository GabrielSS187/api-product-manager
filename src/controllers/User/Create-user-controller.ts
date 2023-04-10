import { Request, Response } from "express";
import { CreateUserCase } from "../../use-cases/User/Create-user-case";
import { UserRepository } from "../../repositories/bd/BD-user-repository";
import { BCryptAdapter } from "../../adapters/BcryptAdapter/Bcrypt-adapter";

export class CreateUserController {
  async create (req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const userRepository = new UserRepository();
    const bcryptAdapter = new BCryptAdapter();
    const loginUserCase = new CreateUserCase(
      userRepository,
      bcryptAdapter,
    );

    const result = await loginUserCase.create({
      name,
      email,
      password
    });

    return res.status(result.statusCode).json(result.success);
  };
};