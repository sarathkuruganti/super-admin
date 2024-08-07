import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './../../../firebase';
import { EyeIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'factory-invoice'));
        const invoicesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setInvoices(invoicesData);
      } catch (error) {
        console.error('Error fetching invoices: ', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-t-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  const handleViewClick = (invoiceNumber) => {
    navigate(`/screen/invoicedetails/${invoiceNumber}`); // Navigate to invoice details page
  };

  return (
    <div className="container mx-auto">
       <h2 className="text-2xl font-bold mb-6 text-center">Invoices</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Customer Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Issued</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Factory Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Issued Person</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice, index) => (
              <tr key={invoice.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{invoice.invoiceNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{invoice.invoiceTo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{invoice.customerAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{invoice.total}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(invoice.dateIssued).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{invoice.factoryDetails}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{invoice.salesPerson}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <button 
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleViewClick(invoice.invoiceNumber)} // Add onClick handler
                  >
                    <h5>View</h5>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Invoice;
