import express from 'express';
const router = express.Router();
import { registerAdmin, loginAdmin, getAllOrders, getAllSellers, toggleApprove, getAllProducts } from '../controller/admincontroller.js';

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/orders', getAllOrders);
router.get('/sellers', getAllSellers);
router.put('/toggle-approve/:sellerId', toggleApprove);
router.get('/products', getAllProducts);


export default router;
