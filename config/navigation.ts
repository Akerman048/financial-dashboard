import type { IconType } from "react-icons";
import { RiHome3Fill } from "react-icons/ri";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdSavings } from "react-icons/md";
import { FaChartPie } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

type Navigation = {
  href: string;
  label: string;
  icon: IconType;
};

const navigation: Navigation[] = [
  { href: "/", label: "Overview", icon: RiHome3Fill },
  { href: "/transactions", label: "Transactions", icon: FaMoneyBillTransfer },
  { href: "/savings", label: "Savings", icon: MdSavings },
  { href: "/analytics", label: "Analytics", icon: FaChartPie },
  { href: "/settings", label: "Settings", icon: IoMdSettings },
];

export default navigation;