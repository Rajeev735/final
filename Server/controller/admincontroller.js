import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import Admin from '../model/adminModel.js'
import orderModel from '../model/order.js';
import sellermodel from '../model/sellermodel.js';
import addproductmodel from '../model/addproduct.js';

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, message: 'Registered successfully', token, name: newAdmin.name });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, message: 'Login successful', token, user: { name: admin.name } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllOrders = async (req, res) => {


  try {
    const orders = await orderModel.find({ 
     
    })
    .populate("user", "name email")
    .populate("items.productId", "title price brand")
     .populate("items.sellerId", "name email")
    .sort({ placedAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    
 
    
    return res.status(200).json({success:true,orders});

  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }

};

export const getAllSellers=async(req,res)=>{

  const sellers=await sellermodel.find({})

  if(!sellers.length){
     return res.status(404).json({ message: "No sellers found" });
  }

    return res.status(200).json({ success:true,sellers});

}

export const toggleApprove = async (req, res) => {
  try {
    const { sellerId } = req.params;


    
    const seller = await sellermodel.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const updatedSeller = await sellermodel.findByIdAndUpdate(
      sellerId,
      { approved: !seller.approved },
      { new: true } 
    );

    return res.status(200).json({
      success: true,
      message: `Seller ${updatedSeller.approved ? "approved" : "disapproved"} successfully.`,
      seller: updatedSeller,
    });

  } catch (error) {
    console.error("Error toggling seller approval:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const getAllProducts=async(req,res)=>{

   const products=await addproductmodel.find({})

   if(!products){
    return res.status(404).json({success:false,message:"no prucducts found"})
   }


   return res.status(200).json({success:true,products})


}