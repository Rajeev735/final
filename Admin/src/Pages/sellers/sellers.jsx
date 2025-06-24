import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";

function SellersList() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/sellers`);
      if (data.success) {
        setSellers(data.sellers);
        console.log(data)
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApprove = async (sellerId) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/toggle-approve/${sellerId}`
      );
      if (data.success) {
        setSellers((prevSellers) =>
          prevSellers.map((s) => (s._id === sellerId ? data.seller : s))
        );
      }
    } catch (error) {
      console.error("Error toggling seller approval:", error);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  return (
    <div className="p-4 max-w-full bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Seller List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller._id} className="border-t">
                <td className="p-2 border">{seller.name}</td>
                <td className="p-2 border">{seller.email}</td>
                <td className="p-2 border">
                  {seller.approved ? "Approved" : "Not Approved"}
                </td>
                <td className="p-2 border">
                  <Button
                    variant="contained"
                    color={seller.approve ? "secondary" : "primary"}
                    onClick={() => handleToggleApprove(seller._id)}
                  >
                    {seller.approved ? "Disapprove" : "Approve"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SellersList;
