import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';
const BASE_URL = 'http://api.exchangeratesapi.io/v1/latest?access_key=90df757f15bc78b600e216530ab81d29'

function App() {
  
  const [currencyOptions, setCurrencyOption] = useState([])
  const [fromCurrency, setFromCurrency] = useState({})
  const [toCurrency, setToCurrency] = useState({})
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  function handleErrors(response){
    if(!response.ok){
      throw Error(response.statusText);
    }
    return response;
  }

  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        const FirstCurrency = Object.keys(data.rates)[0]
        setCurrencyOption([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base)
        setToCurrency(FirstCurrency)
        setExchangeRate(data.rates[FirstCurrency])
      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(handleErrors)
        .then(res => res.json)
        .then(data => setExchangeRate(data.rates[toCurrency]))
        .catch(function (error){
          console.log(error)
        });
    }
  }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }
  return (
    <>
      <h1>Currency Converter</h1>
      <CurrencyRow 
        currencyOptions = {currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow 
        currencyOptions = {currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </>
  );
}

export default App;
