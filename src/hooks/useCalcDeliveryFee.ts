import { useState } from "react";
import { DateTime, Interval } from "luxon";
import constants from "../utils/constants";
import { DeliveryFeeParam } from "../utils/feeValidation";


const useCalcDeliveryFee = () => {

    const [deliveryFee, setDeliveryFee] = useState<number | null>(null);

    const calculateFee = ({ cartValue, deliveryDistance, itemNum, orderTime }: DeliveryFeeParam) => {
        let total = 0;

        if(cartValue >= constants.FREE_DELIVERY_BENCHMARK) {
            setDeliveryFee(total);
            return;
        }

        // CART VALUE FEE
        if(cartValue < constants.SMALL_ORDER_MINIMUM) {
            total += (constants.SMALL_ORDER_MINIMUM - cartValue) * 100;
        }

        // DELIVERY DISTANCE FEE
        total += constants.DISTANCE_DEFAULT_FEE;
        if(deliveryDistance - constants.DISTANCE_DEFAULT > 0) {
            total += Math.ceil((deliveryDistance - constants.DISTANCE_DEFAULT) / constants.DISTANCE_BENCHMARK) * 100;
        }

        // ITEM NUMBER FEE
        if(itemNum > constants.FREE_ITEMS_MINIMUM) {
            total += ((itemNum - constants.FREE_ITEMS_MINIMUM) * constants.ADDITIONAL_ITEMS_SURCHARGE);
        }
        if(itemNum > constants.EXTRA_BULK_MINIMUM) {
            total += constants.EXTRA_BULK_SURCHARGE;
        }

        // FRIDAY RUSH FEE
        const dt = DateTime.fromISO(orderTime.toISOString()).toUTC();
        if(dt.weekday === 5) {
            const startDate = dt.set({hour: 15, minute: 0, second: 0});
            const endDate = dt.set({hour: 19, minute: 0, second: 0});
            const interval = Interval.fromDateTimes(startDate, endDate);
            
            if(interval.contains(dt)) {
                total *= constants.FRIDAY_RUSH_SURCHARGE;
            }
        }

        total = total / 100;
        total = total > constants.MAXIMUM_DELIVERY_FEE ? constants.MAXIMUM_DELIVERY_FEE : total;
        setDeliveryFee(total);
    }


    return {deliveryFee, calculateFee};
}

export default useCalcDeliveryFee;