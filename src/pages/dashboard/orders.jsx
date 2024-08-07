import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './../../../firebase';

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const registrationsSnapshot = await getDocs(collection(db, 'registrations'));
        const ordersSnapshot = await getDocs(collection(db, 'DOrders'));

        const registrationsData = registrationsSnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          if (data.email) {
            acc[data.email] = {
              name: data.name,
              phone: data.phone,
              address: data.address,
              district: data.district,
              state: data.state,
              Type: data.userType,
              source: 'registrations'
            };
          }
          return acc;
        }, {});

        const ordersData = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          productName: doc.data().productName,
          price: doc.data().price,
          quantity: doc.data().quantity,
          totalAmount: doc.data().totalAmount,
          email: doc.data().email,
          source: 'DOrders'
        }));

        const combinedData = ordersData.map(order => {
          const registration = registrationsData[order.email];
          return { ...order, ...registration };
        });

        const allColumns = new Set();
        combinedData.forEach(order => {
          Object.keys(order).forEach(key => {
            if (key !== 'id' && key !== 'source') {
              allColumns.add(key);
            }
          });
        });

        setColumns([...allColumns]);
        setOrders(combinedData);
      } catch (error) {
        console.error('Error fetching orders: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-t-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Orders</h2>
        <div className="hidden sm:block overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-black">
              <tr>
                {columns.map(column => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-100">
                  {columns.map(column => (
                    <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order[column] || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="block sm:hidden">
          {orders.map(order => (
            <div key={order.id} className="bg-white shadow-lg rounded-lg overflow-hidden mb-4">
              <div className="p-4">
                {columns.map(column => (
                  <div key={column} className="mb-2 flex">
                    <strong className="text-black mr-2 capitalize">{column}:</strong>
                    <span className="text-gray-900">{order[column] || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;
