import React, { useState, useEffect } from "react";

import { loadStripe } from "@stripe/stripe-js";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {
  PaymentElement,
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

import useStyles from "./styles";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51JroW4HYKMUTgbq9HL8MzQTX2PGAqTsQMwOOBCFJ02No1Nar9vKT1Rp0I5HWYZDxE85jBkGhX86A46hOqggshiuh008RrbNRLk"
);

const TestStripe = ({ getCurrentpayment, setCurrentCardInfo }) => {
  const classes = useStyles();
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(async () => {
    let { data } = await axios.get("http://localhost:3000/api/get-customers");

    let customersData = data.customers.data;
    console.log(customersData);
    setCustomers(customersData);
  }, []);

  const getPayment = (data) => {
    let paymentsCopy = [...payments];
    paymentsCopy.push(data);
    setPayments(paymentsCopy);
  };

  return (
    <Box p={5}>
      <Box p={5}>
        <Elements stripe={stripePromise}>
          <CheckoutForm
            getPayment={getPayment}
            setCurrentCardInfo={setCurrentCardInfo}
            getCurrentpayment={getCurrentpayment}
          />
        </Elements>
      </Box>

      <div className={classes.rootListCards}>
        <b>Customers</b>
        <List component="nav" aria-label="main mailbox folders">
          {customers.map((customer) => (
            <ListItem button key={customer.id}>
              <ListItemText
                primary={customer.email}
                onClick={() => getCurrentpayment(customer.id)}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </Box>
  );
};

const CheckoutForm = ({
  getPayment,
  getCurrentpayment,
  setCurrentCardInfo,
}) => {
  const [email, setEmail] = useState([]);
  const elements = useElements();
  const stripe = useStripe();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }
    /*
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
*/

    setCurrentCardInfo(elements.getElement(CardElement));

    /* let response = await axios.post("http://localhost:3000/api/checkout", {
      id: token.id,
    });
*/
    //console.log(token.id);
    //getCurrentpayment(token.id);
  };

  const setEmailInput = (event) => {
    console.log(event.target.value);
    setEmail(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="email"
        label="email"
        name="emailP"
        value={email}
        onChange={setEmailInput}
      />

      <CardElement options={{ hidePostalCode: true }} />

      <Box p={3}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!stripe || !elements}
        >
          Create payment method
        </Button>
      </Box>
    </form>
  );
};
export default TestStripe;
