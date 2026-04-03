import clsx from "clsx";
import React from "react";
import { GiMoneyStack } from "react-icons/gi";

export default function Logo() {
  return (
    <div className={clsx(
            "flex gap-3  p-3",
            "w-full",
            "sm:w-64 sm:ml-3 sm:rounded-2xl",
            " backdrop-blur-md  border-white/10",
          )}>
      <GiMoneyStack className="text-4xl animate-float" />
      <span className="text-xl font-heading">Money stack</span>
    </div>
  );
}
