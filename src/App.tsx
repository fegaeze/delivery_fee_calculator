import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

import './App.css';
import Input from './components/Input/Input';
import useCalcDeliveryFee from "./hooks/useCalcDeliveryFee";
import { schema, DeliveryFeeParam } from "./utils/feeValidation";


const App = () => {

  const {deliveryFee, calculateFee} = useCalcDeliveryFee();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<DeliveryFeeParam>({
    resolver: yupResolver(schema)
  });

  const onSubmit = handleSubmit((data) => {
    calculateFee(data);
    reset();
  });

  return (
    <div className="App">
      <header className="App-header has-flex">
        <h1>Delivery Fee Calculator</h1>
        {deliveryFee !== null && <p>Delivery Fee: {deliveryFee} €</p>}
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
