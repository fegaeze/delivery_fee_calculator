import { renderHook, act } from "@testing-library/react";

import constants from "../utils/constants";
import useCalcDeliveryFee from "./useCalcDeliveryFee";


const getRandomNumFromRange = (min:number, max:number, precision:number=100) => {
    return Math.floor(Math.random() * (max*precision - min*precision) + min*precision) / precision;
}

describe("useCalcDeliveryFee - Cart Value Requirements", () => {
    test('delivery fee is 0 when cart value >= 100 euros', () => {
        const { result } = renderHook(() => useCalcDeliveryFee());
        const randomNum = getRandomNumFromRange(constants.FREE_DELIVERY_BENCHMARK, 10000);
        act(() => {
            result.current.calculateFee({
                cartValue: randomNum,
                deliveryDistance: constants.DISTANCE_DEFAULT,
                itemNum: constants.FREE_ITEMS_MINIMUM,
                orderTime: new Date("February 5, 2023 18:30:00")
            })
        })

        expect(result.current.deliveryFee).toBe(0);
    })

    test('delivery fee is NOT 0 when cart value < 100 euros', () => {
        const { result } = renderHook(() => useCalcDeliveryFee());
        const randomNum = getRandomNumFromRange(0, constants.FREE_DELIVERY_BENCHMARK);
        act(() => {
            result.current.calculateFee({
                cartValue: randomNum,
                deliveryDistance: constants.DISTANCE_DEFAULT,
                itemNum: constants.FREE_ITEMS_MINIMUM,
                orderTime: new Date("February 5, 2023 18:30:00")
            })
        })

        expect(result.current.deliveryFee).not.toBe(0);
    })

    test('small order surcharge is added when cart value < 10 euros', () => {
        const { result } = renderHook(() => useCalcDeliveryFee());

        act(() => {
            result.current.calculateFee({
                cartValue: 8.90,
                deliveryDistance: constants.DISTANCE_DEFAULT,
                itemNum: constants.FREE_ITEMS_MINIMUM,
                orderTime: new Date("February 5, 2023 18:30:00"),
            })
        })

        const deliveryFee = constants.DISTANCE_DEFAULT_FEE/100 + 1.10;
        expect(result.current.deliveryFee).toBe(deliveryFee);
    })

    test('small order surcharge is NOT added when cart value >= 10 euros', () => {
        const { result } = renderHook(() => useCalcDeliveryFee());
        act(() => {
            result.current.calculateFee({
                cartValue: getRandomNumFromRange(constants.SMALL_ORDER_MINIMUM, constants.FREE_DELIVERY_BENCHMARK),
                deliveryDistance: constants.DISTANCE_DEFAULT,
                itemNum: constants.FREE_ITEMS_MINIMUM,
                orderTime: new Date("February 5, 2023 18:30:00")
            })
        })

        const deliveryFee = constants.DISTANCE_DEFAULT_FEE/100;
        expect(result.current.deliveryFee).toBe(deliveryFee);
    })
})

describe("useCalcDeliveryFee - Delivery Distance Requirements", () => {
    test('delivery fee is 2 euros when distance is <= 1000 meters', () => {
        const { result } = renderHook(() => useCalcDeliveryFee());

        act(() => {
            result.current.calculateFee({
                cartValue: getRandomNumFromRange(constants.SMALL_ORDER_MINIMUM, constants.FREE_DELIVERY_BENCHMARK),
                deliveryDistance: getRandomNumFromRange(0, constants.DISTANCE_DEFAULT + 1),
                itemNum: constants.FREE_ITEMS_MINIMUM,
                orderTime: new Date("February 5, 2023 18:30:00")
            })
        })

        expect(result.current.deliveryFee).toBe(2);
    })

    test('delivery fee has 1 euro added for every additional 500 meters', () => {
        const { result } = renderHook(() => useCalcDeliveryFee());
        const randomNum = getRandomNumFromRange(1, 10, 1);
        const distance = constants.DISTANCE_DEFAULT + (constants.DISTANCE_BENCHMARK * randomNum)

        act(() => {
            result.current.calculateFee({
                cartValue: getRandomNumFromRange(constants.SMALL_ORDER_MINIMUM, constants.FREE_DELIVERY_BENCHMARK),
                deliveryDistance: distance,
                itemNum: constants.FREE_ITEMS_MINIMUM,
                orderTime: new Date("February 5, 2023 18:30:00")
            })
        })

        const deliveryFee = constants.DISTANCE_DEFAULT_FEE/100 + randomNum;
        expect(result.current.deliveryFee).toBe(deliveryFee);
    })

    test('delivery fee has 1 euro added for every additional 500 meters even if distance is shorter', () => {
        const { result } = renderHook(() => useCalcDeliveryFee());
        const randomNum = getRandomNumFromRange(1, 10, 1);
        const distance = constants.DISTANCE_DEFAULT + (constants.DISTANCE_BENCHMARK * randomNum) + getRandomNumFromRange(1, 500, 1);

        act(() => {
            result.current.calculateFee({
                cartValue: getRandomNumFromRange(constants.SMALL_ORDER_MINIMUM, constants.FREE_DELIVERY_BENCHMARK),
                deliveryDistance: distance,
                itemNum: constants.FREE_ITEMS_MINIMUM,
                orderTime: new Date("February 5, 2023 18:30:00")
            })
        })

        const deliveryFee = constants.DISTANCE_DEFAULT_FEE/100 + randomNum + 1;
        expect(result.current.deliveryFee).toBe(deliveryFee);
    })
})

describe("useCalcDeliveryFee - Item Number Requirements", () => {
    test('no surcharge when number of items <= 4', () => {
        const { result } = renderHook(() => useCalcDeliveryFee());

        act(() => {
            result.current.calculateFee({
                cartValue: getRandomNumFromRange(constants.SMALL_ORDER_MINIMUM, constants.FREE_DELIVERY_BENCHMARK - 1),
                deliveryDistance: constants.DISTANCE_DEFAULT,
                itemNum: getRandomNumFromRange(1, constants.FREE_ITEMS_MINIMUM),
                orderTime: new Date("February 5, 2023 18:30:00")
            })
        })

        expect(result.current.deliveryFee).toBe(2);
    })

    test('50 cent surcharge is added when number of items >= 5', () => {
        const { result } = renderHook(() => useCalcDeliveryFee());
        const randomNum = getRandomNumFromRange(1, (constants.EXTRA_BULK_MINIMUM + 1) - constants.FREE_ITEMS_MINIMUM, 1)

        act(() => {
            result.current.calculateFee({
                cartValue: getRandomNumFromRange(constants.SMALL_ORDER_MINIMUM, constants.FREE_DELIVERY_BENCHMARK),
                deliveryDistance: constants.DISTANCE_DEFAULT,
                itemNum: constants.FREE_ITEMS_MINIMUM + randomNum,
                orderTime: new Date("February 5, 2023 18:30:00")
            })
        })


        const deliveryFee = constants.DISTANCE_DEFAULT_FEE/100 + (randomNum * (constants.ADDITIONAL_ITEMS_SURCHARGE / 100));
        expect(result.current.deliveryFee).toBe(deliveryFee);
    })

    test('an extra "bulk" fee applies for > 12 items', () => {
        const { result } = renderHook(() => useCalcDeliveryFee());
        const randomNum = getRandomNumFromRange(constants.EXTRA_BULK_MINIMUM - constants.FREE_ITEMS_MINIMUM, 22, 1)

        act(() => {
            result.current.calculateFee({
                cartValue: getRandomNumFromRange(constants.SMALL_ORDER_MINIMUM, constants.FREE_DELIVERY_BENCHMARK),
                deliveryDistance: constants.DISTANCE_DEFAULT,
                itemNum: constants.FREE_ITEMS_MINIMUM + randomNum,
                orderTime: new Date("February 5, 2023 18:30:00")
            })
        })


        const deliveryFee = 
            constants.DISTANCE_DEFAULT_FEE/100 + 
            (randomNum * (constants.ADDITIONAL_ITEMS_SURCHARGE / 100)) + 
            (constants.EXTRA_BULK_SURCHARGE / 100);
        expect(result.current.deliveryFee).toBe(deliveryFee);
    })
})

describe("useCalcDeliveryFee - Friday Rush Hour Requirement", () => {
    test('during the friday rush (3 - 7 PM UTC), the delivery fee will be multiplied by 1.2x', () => {
        const { result } = renderHook(() => useCalcDeliveryFee());
        const randomHour = getRandomNumFromRange(17, 21, 1); //In Local Time
        const randomMinute = getRandomNumFromRange(0, 60, 1);
        const randomSecond = getRandomNumFromRange(0, 60, 1);
        const randomDate = new Date(2023, 1, 10, randomHour, randomMinute, randomSecond)


        act(() => {
            result.current.calculateFee({
                cartValue: getRandomNumFromRange(constants.SMALL_ORDER_MINIMUM, constants.FREE_DELIVERY_BENCHMARK),
                deliveryDistance: constants.DISTANCE_DEFAULT,
                itemNum: constants.FREE_ITEMS_MINIMUM,
                orderTime: randomDate
            })
        })

        const deliveryFee = constants.DISTANCE_DEFAULT_FEE/100 * constants.FRIDAY_RUSH_SURCHARGE;
        expect(result.current.deliveryFee).toBe(deliveryFee);
    })

    test('during other days of the week, the delivery fee will NOT be multiplied by 1.2x', () => {
        const { result } = renderHook(() => useCalcDeliveryFee());
        const randomHour = getRandomNumFromRange(17, 21, 1); //In Local Time
        const randomMinute = getRandomNumFromRange(0, 60, 1);
        const randomSecond = getRandomNumFromRange(0, 60, 1);
        const randomDate = new Date(2023, 1, 11, randomHour, randomMinute, randomSecond)


        act(() => {
            result.current.calculateFee({
                cartValue: getRandomNumFromRange(constants.SMALL_ORDER_MINIMUM, constants.FREE_DELIVERY_BENCHMARK),
                deliveryDistance: constants.DISTANCE_DEFAULT,
                itemNum: constants.FREE_ITEMS_MINIMUM,
                orderTime: randomDate
            })
        })

        const deliveryFee = constants.DISTANCE_DEFAULT_FEE/100;
        expect(result.current.deliveryFee).toBe(deliveryFee);
    })

    test('during other times on friday, the delivery fee will NOT be multiplied by 1.2x', () => {
        const { result } = renderHook(() => useCalcDeliveryFee());
        const randomHour = getRandomNumFromRange(1, 15, 1); //In Local Time
        const randomMinute = getRandomNumFromRange(0, 60, 1);
        const randomSecond = getRandomNumFromRange(0, 60, 1);
        const randomDate = new Date(2023, 1, 10, randomHour, randomMinute, randomSecond)


        act(() => {
            result.current.calculateFee({
                cartValue: getRandomNumFromRange(constants.SMALL_ORDER_MINIMUM, constants.FREE_DELIVERY_BENCHMARK),
                deliveryDistance: constants.DISTANCE_DEFAULT,
                itemNum: constants.FREE_ITEMS_MINIMUM,
                orderTime: randomDate
            })
        })

        const deliveryFee = constants.DISTANCE_DEFAULT_FEE/100;
        expect(result.current.deliveryFee).toBe(deliveryFee);
    })
})

describe("useCalcDeliveryFee - Delivery Fee Maximum", () => {
    test('delivery fee can never be > 15€, including possible surcharges', () => {
        const { result } = renderHook(() => useCalcDeliveryFee());
        const randomNum = getRandomNumFromRange(3, 10, 1);
        const randomDistance = constants.DISTANCE_DEFAULT + (constants.DISTANCE_BENCHMARK * randomNum)
        const randomItemNum = getRandomNumFromRange(constants.EXTRA_BULK_MINIMUM - constants.FREE_ITEMS_MINIMUM, 22, 1)

        act(() => {
            result.current.calculateFee({
                cartValue: 1,
                deliveryDistance: randomDistance,
                itemNum: constants.FREE_ITEMS_MINIMUM + randomItemNum,
                orderTime: new Date("February 10, 2023 19:30:00")
            })
        })

        expect(result.current.deliveryFee).toBe(15);
    })
})