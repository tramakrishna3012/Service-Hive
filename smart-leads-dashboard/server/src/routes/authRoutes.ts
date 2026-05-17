import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { registerValidator, loginValidator } from '../validators/authValidator';

const router = Router();

router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);

export default router;
