import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

import './App.css';
import Input from './components/Input/Input';
import useCalcDeliveryFee from "./hooks/useCalcDeliveryFee";


const errorMsgs = {
  requiredError: 'This field is required',
  signError: 'Please fill in a number greater than 0',
  minDateError: 'Date cannot be in the past',
  typeError: {
    number: 'Please fill in numbers only',
    date: 'Please fill in appropriate data format'
  }
}

const schema = yup.object({
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
    .default(() => new Date())
    .typeError(errorMsgs.typeError.date)
}).required();

type FormData = yup.InferType<typeof schema>;


const App = () => {

  const {deliveryFee, calculateFee, resetFee} = useCalcDeliveryFee();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = handleSubmit((data) => {
    const { cartValue, deliveryDistance, itemNum, orderTime } = data;
    resetFee();

    calculateFee(cartValue, deliveryDistance, itemNum, orderTime);
    reset();
  });

  return (
    <div className="App">
      <header className="App-header has-flex">
        <h1>Delivery Fee Calculator</h1>
        {deliveryFee && <p>Delivery Fee: {deliveryFee} euros</p>}
      </header>

      <div className="App-content has-flex">
        <form onSubmit={onSubmit}>
          <Input 
            autoFocus
            step="0.001"
            label="Cart Value" 
            inputType="number" 
            inputName="cartValue" 
            inputErrorMessage={errors.cartValue?.message} 
            {...register("cartValue")} 
          />

          <Input 
            label="Delivery Distance" 
            inputType="number" 
            inputName="deliveryDistance" 
            inputErrorMessage={errors.deliveryDistance?.message} 
            {...register("deliveryDistance")} 
          />

          <Input 
            label="Amount of Items" 
            inputType="number" 
            inputName="itemNum" 
            inputErrorMessage={errors.itemNum?.message} 
            {...register("itemNum")} 
          />

          <Input 
            disabled
            label="Time" 
            inputType="datetime-local" 
            inputName="orderTime" 
            inputErrorMessage={errors.orderTime?.message} 
            {...register("orderTime")} 
          />

          <button>Calculate Delivery Fee</button>
        </form>
      </div>
    </div>
  );
}

export default App;
