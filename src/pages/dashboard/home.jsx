import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // Adjust the path as necessary
import { BanknotesIcon, UserPlusIcon, UsersIcon, ChartBarIcon } from "@heroicons/react/24/solid";

export function Home() {
  const [statisticsCardsData, setStatisticsCardsData] = useState([
    {
      color: "orange",
      icon: BanknotesIcon,
      title: "Total Expenses",
      value: "0.00",
      footer: {
        color: "text-red-500",
        value: "",
        label: "Spent on raw materials",
      },
    },
    {
      color: "green",
      icon: UsersIcon,
      title: "Total Earnings",
      value: "0.00",
      footer: {
        color: "text-green-500",
        value: "",
        label: "Total earnings from orders",
      },
    },
    {
      color: "blue",
      icon: UserPlusIcon,
      title: "Profit or Loss",
      value: "0.00",
      footer: {
        color: "text-blue-500",
        value: "",
        label: "Profit or Loss",
      },
    },
    {
      color: "purple",
      icon: ChartBarIcon,
      title: "Total Orders",
      value: 0,
      footer: {
        color: "text-blue-500",
        value: "",
        label: "Total number of orders",
      },
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const rawMaterialsSnapshot = await getDocs(collection(db, 'rawMaterials'));
      const ordersSnapshot = await getDocs(collection(db, 'DOrders'));
      const productsSnapshot = await getDocs(collection(db, 'products'));

      const rawMaterialsData = rawMaterialsSnapshot.docs.map(doc => doc.data());
      const ordersData = ordersSnapshot.docs.map(doc => doc.data());
      const productsData = productsSnapshot.docs.map(doc => doc.data());

      const rawMaterialsCount = rawMaterialsSnapshot.size;
      const ordersCount = ordersSnapshot.size;
      const productsCount = productsSnapshot.size;

      const totalExpenses = rawMaterialsData.reduce((sum, item) => sum + parseFloat(item.price), 0);
      const totalEarnings = ordersData.reduce((sum, item) => sum + item.totalAmount, 0);
      const totalProfitOrLoss = totalEarnings - totalExpenses;

      setStatisticsCardsData([
        {
          color: "orange",
          icon: BanknotesIcon,
          title: "Total Expenses",
          value: `${totalExpenses.toFixed(2)}`,
          footer: {
            color: "text-red-500",
            value: "",
            label: "Spent on raw materials",
          },
        },
        {
          color: "green",
          icon: UsersIcon,
          title: "Total Earnings",
          value: `${totalEarnings.toFixed(2)}`,
          footer: {
            color: "text-green-500",
            value: "",
            label: "Total earnings from orders",
          },
        },
        {
          color: "blue",
          icon: UserPlusIcon,
          title: "Profit or Loss",
          value: `${totalProfitOrLoss.toFixed(2)}`,
          footer: {
            color: totalProfitOrLoss >= 0 ? "text-green-500" : "text-red-500",
            value: "",
            label: totalProfitOrLoss >= 0 ? "Profit from Orders" : "Loss from Orders",
          },
        },
        {
          color: "purple",
          icon: ChartBarIcon,
          title: "Total Orders",
          value: ordersCount,
          footer: {
            color: "text-blue-500",
            value: "",
            label: "Total number of orders",
          },
        },
      ]);
    };

    fetchData();
  }, []);

  return (
    <div className="">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Statistics charts section */}
      </div>
    </div>
  );
}

export default Home;
