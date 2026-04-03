"use client";
import SavingsCalculatorCard from "@/components/savings/SavingsCalculatorCard";

import SavingsSection from "@/components/savings/SavingsSection";

export default function Savings() {
  return (
    <div className="flex flex-col gap-4 lg:h-full lg:min-h-0 lg:grid lg:grid-cols-12 lg:grid-rows-5 lg:overflow-hidden">
     <SavingsSection/>
     <SavingsCalculatorCard/>
    </div>
  );
}
