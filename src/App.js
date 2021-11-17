import React, { useState, useEffect } from "react";
import "./App.css";
import TestStripe from "./stripe";
import Button from "@material-ui/core/Button";
import useStyles from "./styles";
import { Grid, Paper, Container } from "@material-ui/core";
import Products from "./Products";
import CustomerStripe from "./components/customerStripe";
import StripeGlobal from "./components/stripeGlobal";

function App() {
  const classes = useStyles();

  return (
    <Container maxWidth="sm">
      <StripeGlobal />
      {/*<CustomerStripe />*/}
    </Container>
  );
}

export default App;
