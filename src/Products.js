import "./App.css";
import useStyles from "./styles";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51JroW4HYKMUTgbq9HL8MzQTX2PGAqTsQMwOOBCFJ02No1Nar9vKT1Rp0I5HWYZDxE85jBkGhX86A46hOqggshiuh008RrbNRLk"
);

const Products = ({ currentPayment, currentCardInfo, stripe }) => {
  const [products, setProducts] = useState([]);

  useEffect(async () => {
    let { data } = await axios.get("http://localhost:3000/api/products");

    let productosResponse = data.products.data;
    let pricesResponse = data.prices.data;

    productosResponse = productosResponse.map((product) => {
      const position = pricesResponse.findIndex(
        (price) => price.product === product.id
      );

      if (position !== -1) product.price = pricesResponse[position].unit_amount;
      return product;
    });

    setProducts(productosResponse);
  }, []);
  return (
    <Elements stripe={stripePromise}>
      {products.map((product) => (
        <Producto
          stripe={stripePromise}
          currentCardInfo={currentCardInfo}
          key={product.id}
          product={product}
          currentPayment={currentPayment}
        />
      ))}
    </Elements>
  );
};

export default Products;

const Producto = ({ product, currentCardInfo }) => {
  const classes = useStyles();
  const stripe = useStripe();
  const pay = async (product) => {
    console.log(currentCardInfo);

    const { token } = await stripe.createToken(currentCardInfo);
    console.log(token);
    let response = await axios.post("http://localhost:3000/api/checkout", {
      id: token.id,
      amount: product.price,
      description: product.description,
    });
    alert("Success pay");
    console.log(response);
  };

  return (
    <Card className={classes.rootCard}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={product.name}
          height="140"
          image={product.images[0]}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {product.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {product.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => pay(product)}>
          pay {product.price}
        </Button>
      </CardActions>
    </Card>
  );
};
