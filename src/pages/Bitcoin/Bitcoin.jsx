import React, { useEffect } from 'react'
import './Bitcoin.css';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import { useState, useMemo } from "react";
import { AiOutlineSearch } from 'react-icons/ai';
import { IconButton } from '@mui/material';
import { useStateContext } from '../../contexts/ContextProvider';
import { useForceUpdate } from '../../components/CustomHooks/useForceUpdate';
import { useRef, useCallback } from 'react';
import AddressForm from '../../components/AddressForm/AddressForm.tsx';

//1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv
const Bitcoin = () => {
  const gridRef = useRef(null);
  const { columnDefs,
  } = useStateContext();

  const [rowData, setRowData] = useState({});
  const [timeStamp, setTimeStamp] = useState('');
  const [inputValue, setInputValue] = useState('1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv');
  const BALANCE_URL = 'https://chain.api.btc.com/v3/address/';
  const PRICE_URL = 'https://min-api.cryptocompare.com/data/v2/histohour?fsym=ETH&tsym=EUR&limit=1&toTs=';
  const [counter, setCounter] = useState(0);

  const defaultColDef = useMemo( () => ({
    sortable: true, filter: true, editable: true, resizeable: true
  }), []);

  const showGrid = (gridResult) => {
    const date = new Date();
    const gridOptions = {
      pagination: true,
      columnDefs: columnDefs,
      rowData: { data: gridResult},
      defaultColDef: {
        resizable: true,
      }
    }
    setTimeStamp(date.toISOString())
    setRowData((cur) => (
      gridOptions
    ));
    setTimeout(() => {
      console.log("rowData: ", rowData);
      console.log("gridOptions: ", gridOptions);
    }, 2000);
    console.log("Finished");
    // forceUpdate();
  };


  const forceUpdate = useForceUpdate();
  
  const getBtcPrice = async (timeStamp) => {
    const URL = `${PRICE_URL}${timeStamp}`;
    const response = await fetch(URL);
    return await response.json();
  };

  const setTime = (timestamp, row) => {
    row.date = new Date(Number(timestamp * 1000)).toISOString().split('T')[0];
    row.time = new Date(Number(timestamp * 1000)).toISOString().split('T')[1].split('.')[0];
    row.timestamp = timestamp;
  };

  const setValue = (row) => {
    row.value = satoshiToBtc(row.result);
    row.inOrOut = row.value > 0 ? "IN" : "OUT";
  };

  let satoshiToBtc = (satoshis) => {
    return satoshis / Math.pow(10, 8);
  };

  const fetchData = async (address) => {
    const transactions_response = await fetch(BALANCE_URL + address + "/tx");
    const transactions_data = await transactions_response.json();
    return transactions_data.data.list;
  }

  const setGrid = async (address) => {
    let gridResult = [];
    console.log("Loading started...");
    const data = await fetchData(address);
    for (let i = 0; i < data.length; i++) {
      let row = data[i];
      setRow(row, gridResult);
    }
    console.log("GridResult:", gridResult);
    showGrid(gridResult);
  }

  const setRow = async (row, gridResult) => {
    const timestamp = row.block_time;
    const btcPrices = await getBtcPrice(timestamp);

    if(btcPrices.Data.Data) {
      let price = btcPrices.Data.Data[1].close;
      setTime(timestamp, row);
      setValue(row);
      
      row.valueInEuro = row.value * price;

      row.hash = row.block_hash;
      let fee = satoshiToBtc(row.fee);
      row.fee = fee;
      row.feeInEuro = price * fee;

      gridResult.push(row);
    }
  }

  const handleSearchButton = () => {
    setGrid(inputValue.trim());
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchButton();
    }
  };

  const renderGrid = (options) =>
    <AgGridReact
    ref={gridRef}
    gridOptions={options}
    rowData={rowData}
    columnDefs={columnDefs}
    defaultColDef={defaultColDef}
    animateRows={true}
    pagination={true}/>
  
  useEffect(() => {

  }, [counter]) 

  const debugging = () => {
    if (rowData) {
      console.log('render: rowData: ', rowData);
      console.log('render: rowData.rowData: ', rowData.rowData);
      console.log('render: rowData.rowData.data: ', rowData.rowData.data);
      console.log('render: rowData.rowData.data.length: ', rowData.rowData.data.length);
    }
    
  }

  return (
    
    <div className="bitcoin">
      <h1 className="headline">Bitcoin</h1>
      <div className="search">
            <IconButton onClick={handleSearchButton}>
                    <AiOutlineSearch className='search__icon'/>
            </IconButton>
        <input
          type="text"
          onKeyDown={handleKeyDown}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='Public Address, e.g. 1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv'
        />
      </div>
      {/* <AddressForm handler={handleSearchButton}></AddressForm> */}

      <div className="ag-theme-balham-dark" style={{ height: 500 }}>
        {
          rowData && rowData.rowData && rowData.rowData.data && rowData.rowData.data.length > 0 ?
          renderGrid(rowData) : 'Loading'
        }
        <button onClick={() => setCounter((cur) => cur + 1)}>Counter up: {counter}</button>
      </div>
      
      
    </div>
  
  )
}

export default Bitcoin
//1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv