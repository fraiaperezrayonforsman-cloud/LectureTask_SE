import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PlatformUser } from "@enterprise-commerce/core/platform/types"
import { createUser } from "../models/User"

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const newUser: PlatformUser = {
    id: null,
    email,
    password
  };

  try {
    const createdUser = await createUser(newUser);
    if (createdUser) {
      res.status(201).json({ user: createdUser });
    } else {
      res.status(400).json({ error: 'Failed to create user' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};