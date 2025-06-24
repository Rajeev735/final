import express from 'express';
const router = express.Router();
import { registerAdmin, loginAdmin, getAllOrders, getAllSellers, toggleApprove } from '../controller/admincontroller.js';

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/orders', getAllOrders);
router.get('/sellers', getAllSellers);
router.put('/toggle-approve/:sellerId', toggleApprove);

export default router;
