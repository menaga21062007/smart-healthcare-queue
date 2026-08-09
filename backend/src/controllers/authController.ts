import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/db';
import { CONFIG } from '../config';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
        include: { doctor: true }
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        CONFIG.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          doctorId: user.doctor?.id,
          specialization: user.doctor?.specialization,
          department: user.doctor?.department
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, role = 'PATIENT', phone } = req.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
          phone
        }
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        CONFIG.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      });
    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async me(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { doctor: { include: { room: true } } }
      });

      if (!user) return res.status(404).json({ message: 'User not found' });

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        doctorId: user.doctor?.id,
        specialization: user.doctor?.specialization,
        department: user.doctor?.department,
        roomNumber: user.doctor?.room?.roomNumber
      });
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
