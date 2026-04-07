import { SavingsCategory } from "@/types/savings.types";
import { FaCar } from "react-icons/fa";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { BsPhoneFill } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa";
import { FaGift } from "react-icons/fa6";
import { RiHeartPulseFill } from "react-icons/ri";
import { FaWallet } from "react-icons/fa";




export const savingsCategoryMeta: Record<
  SavingsCategory,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  Travel: { label: "Travel", icon: BiSolidPlaneAlt },
  Car: { label: "Car", icon: FaCar },
  Gadget: { label: "Gadget", icon: BsPhoneFill },
  House: { label: "House", icon: IoHome },
  Education: { label: "Education", icon: FaUserGraduate },
  Gift: { label: "Gift", icon: FaGift },
  Health: { label: "Health", icon: RiHeartPulseFill },
  Other: { label: "Other", icon: FaWallet },
};
