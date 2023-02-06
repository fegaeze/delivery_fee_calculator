import * as yup from "yup";

const errorMsgs = {
  requiredError: 'This field is required',
  signError: 'Please fill in a number greater than 0',
  minDateError: 'Date cannot be in the past',
  typeError: {
    number: 'Please fill in numbers only',
    date: 'Please fill in appropriate data format'
  }
}

export const schema = yup.object({
  cartValue: yup
    .number()
    .transform(value => (isNaN(value) ? undefined : value))
    .positive(errorMsgs.signError)
    .typeError(errorMsgs.typeError.number)
    .required(errorMsgs.requiredError),
  deliveryDistance: yup
    .number()
    .transform(value => (isNaN(value) ? undefined : value))
    .positive(errorMsgs.signError)
    .typeError(errorMsgs.typeError.number)
    .required(errorMsgs.requiredError),
  itemNum: yup
    .number()
    .transform(value => (isNaN(value) ? undefined : value))
    .positive(errorMsgs.signError)
    .typeError(errorMsgs.typeError.number)
    .required(errorMsgs.requiredError),
  orderTime: yup
    .date()
    .min(new Date(), errorMsgs.minDateError)
    .transform(value => (isNaN(value) ? undefined : value))
    .typeError(errorMsgs.typeError.date)
    .required(errorMsgs.requiredError)
}).required();

export type DeliveryFeeParam = yup.InferType<typeof schema>;