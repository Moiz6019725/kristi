import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ContainerTruck01Icon,TruckReturnIcon,CustomerService01Icon } from "@hugeicons/core-free-icons/index";

const Terms = () => {
  return (
    <div className="flex h-36 justify-evenly my-20 max-[800px]:flex-col max-[800px]:h-auto max-[800px]:gap-10">
      <div className="flex flex-col gap-2 items-center basis-[22%]">
        <HugeiconsIcon icon={ContainerTruck01Icon} size={38} color="#444444" />
        <h3 className="font-semibold text-base">Free Shipping</h3>
        <p className="text-[#444444] text-sm text-center">
          Enjoy free worldwide shipping on all order above Rs 3500.
        </p>
      </div>
      <div className="flex flex-col gap-2 items-center basis-[22%]">
        <HugeiconsIcon icon={TruckReturnIcon} size={38} color="#444444" />
        <h3 className="font-semibold text-base">Free Returns</h3>
        <p className="text-[#444444] text-sm text-center">
          Free returns within 15 days, please make sure the itemsare in
          undamaged condition.
        </p>
      </div>
      <div className="flex flex-col gap-2 items-center basis-[22%]">
        <HugeiconsIcon icon={CustomerService01Icon} size={38} color="#444444" />
        <h3 className="font-semibold text-base">Support Online</h3>
        <p className="text-[#444444] text-sm text-center">
          We support customers 24/7, send questions we willsolve for you
          immediately.
        </p>
      </div>
    </div>
  );
};

export default Terms;
