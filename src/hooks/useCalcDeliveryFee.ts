import { useState } from "react";
import constants from "../utils/constants";

type DeliveryFeeParams = (
    cartValue: number, 
    deliveryDistance: number, 
    itemNum: number, 
    orderTime: Date
) => void;

const useCalcDeliveryFee = () => {

    const [deliveryFee, setDeliveryFee] = useState<number | null>(null);

    const calculateFee: DeliveryFeeParams = (cartValue, deliveryDistance, itemNum, orderTime) => {
        let total = 0;
        if(cartValue >= constants.FREE_DELIVERY_BENCHMARK) return total;

        // CART VALUE FEE
        total += cartValue < constants.SMALL_ORDER_MINIMUM ? (constants.SMALL_ORDER_MINIMUM - cartValue) * 100 : 0;

        // DELIVERY DISTANCE FEE
        total += constants.DISTANCE_DEFAULT_FEE + Math.ceil(deliveryDistance / constants.DISTANCE_BENCHMARK) * 100;

        // ITEM NUMBER FEE
        total += itemNum > constants.FREE_ITEMS_MINIMUM ? (itemNum - constants.FREE_ITEMS_MINIMUM) * constants.ADDITIONAL_ITEMS_SURCHARGE : 0;
        total += itemNum > constants.EXTRA_BULK_MINIMUM ? constants.EXTRA_BULK_SURCHARGE : 0;

        // FRIDAY RUSH FEE
        const isRushHour = true
        total *= isRushHour ? constants.FRIDAY_RUSH_SURCHARGE : 1


        total = total / 100;
        total = total > constants.MAXIMUM_DELIVERY_FEE ? constants.MAXIMUM_DELIVERY_FEE : total;
        setDeliveryFee(total);
    }

    const resetFee = () => setDeliveryFee(null);

    return {deliveryFee, calculateFee, resetFee};
}

export default useCalcDeliveryFee;