import React, { useEffect, useRef, useState } from 'react';
import './Inventory.css';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

const Inventory = () => {
    const inventory = JSON.parse(localStorage.getItem('rowData'))?.filter(row => row.direction === 'IN') || null;
    const soldInventory = JSON.parse(localStorage.getItem('rowData'))?.filter(row => row.direction === 'OUT') || null;
    
    const [fifo, setFifo] = useState(
        JSON.parse(localStorage.getItem('fifo')) || null
    );
    const [lifo, setLifo] = useState(
        JSON.parse(localStorage.getItem('lifo')) || null
    );
    const columnDefs = [
        {
            headerName: 'Value', field: 'value',
            valueFormatter: (p) => `${p.value} BTC`
        },
        {
            headerName: 'Price', field: 'price',
            valueFormatter: (p) => `${p.value} €`
        }
    ];
    const boughtGridRef = useRef();
    const soldGridRef = useRef();
    const fifoGridRef = useRef();
    const lifoGridRef = useRef();

    const columnDefsAccounting = [
        {
            headerName: 'Buy Value', field: 'buy_value',
            valueFormatter: (p) => `${p.value} BTC`
        },
        {
            headerName: 'Buy Price', field: 'buy_price',
            valueFormatter: (p) => `${p.value} €`
        },
        {
            headerName: 'Sell Value', field: 'sell_value',
            valueFormatter: (p) => `${p.value} BTC`
        },
        {
            headerName: 'Sell Price', field: 'sell_price',
            valueFormatter: (p) => `${p.value} €`
        },
        {
            headerName: 'Profit / Loss', field: 'profit_loss',
            valueFormatter: (p) => `${p.value} €`
        }
    ]

    const defaultColDef = {
        sortable: true,
        filter: true,
        editable: true
    };

    const calculateFifo = (inventory, soldInventory) => {
        let result = [];
        let i = 0;
        let j = 0;
        while (i < inventory.length && j < soldInventory.length) {
            let buy = inventory[i];
            let sell = soldInventory[j];
            let buy_value = buy.value;
            let buy_price = buy.price;
            let sell_value = Math.abs(sell.value);
            let sell_price = sell.price;
            let buy_value_left = buy_value - sell_value;
            if (buy_value_left > 0) {
                //simple case
                sell_value = Math.abs(sell_value);
                result.push({
                    buy_value: sell_value,
                    buy_price: buy_price,
                    sell_value: sell_value,
                    sell_price: sell_price,
                    profit_loss: sell_value * sell_price - sell_value * buy_price
                });
                buy.value -= sell.value;
                j++;
            } else if (buy_value_left < 0) {
                //complex case
                sell_value = Math.abs(sell_value);
                result.push({
                    buy_value: buy_value,
                    buy_price: buy_price,
                    sell_value: buy_value,
                    sell_price: sell_price,
                    profit_loss: buy_value * sell_price - buy_value * buy_price
                });
                sell.value -= buy.value;
                i++;
            } else {
                sell_value = Math.abs(sell_value);
                result.push({
                    buy_value: buy_value,
                    buy_price: buy_price,
                    sell_value: sell_value,
                    sell_price: sell_price,
                    profit_loss: buy_value * sell_price - sell_value * buy_price
                });
                i++;
                j++;
            }
        }
        return result;
    }

    const calculateLifo = (inventory, soldInventory) => {
        let result = [];
        let i = inventory.length - 1;
        let j = 0;
        while (i >= 0 && j < soldInventory.length) {
            let buy = inventory[i];
            let sell = soldInventory[j];
            let buy_value = buy.value;
            let buy_price = buy.price;
            let sell_value = Math.abs(sell.value);
            let sell_price = sell.price;
            let buy_value_left = buy_value - sell_value;
            if (buy_value_left > 0) {
                //simple case
                sell_value = Math.abs(sell_value);
                result.push({
                    buy_value: sell_value,
                    buy_price: buy_price,
                    sell_value: sell_value,
                    sell_price: sell_price,
                    profit_loss: sell_value * sell_price - sell_value * buy_price
                });
                buy.value -= sell.value;
                j++;
            } else if (buy_value_left < 0) {
                //complex case
                sell_value = Math.abs(sell_value);
                result.push({
                    buy_value: buy_value,
                    buy_price: buy_price,
                    sell_value: buy_value,
                    sell_price: sell_price,
                    profit_loss: buy_value * sell_price - buy_value * buy_price
                });
                sell.value = sell_value - buy.value;
                i--;
            } else {
                sell_value = Math.abs(sell_value);
                result.push({
                    buy_value: buy_value,
                    buy_price: buy_price,
                    sell_value: sell_value,
                    sell_price: sell_price,
                    profit_loss: buy_value * sell_price - sell_value * buy_price
                });
                i--;
                j++;
            }
        }
        return result;
    }

    useEffect(() => {
        setLifo(() => calculateLifo(
            JSON.parse(localStorage.getItem('rowData'))?.filter(row => row.direction === 'IN') ?? [],
            JSON.parse(localStorage.getItem('rowData'))?.filter(row => row.direction === 'OUT') ?? []
        ));
        setFifo(() => calculateFifo(
            JSON.parse(localStorage.getItem('rowData'))?.filter(row => row.direction === 'IN') ?? [],
            JSON.parse(localStorage.getItem('rowData'))?.filter(row => row.direction === 'OUT') ?? []
        ));
    }, []);


  return (
      <div className='ag-theme-alpine-dark' style={{ width: '1400px', height: '800px', marginTop: '20px' }}>
          {inventory !== null ? <div>
              <div style={{ display: 'flex' }}>
                  <div style={{ height: `calc(50px + (${inventory?.length} * 42px))`, width: '400px' }}>
                      <div style={{display: 'flex'}}>
                          <h1>Bought</h1>
                          <button style={{ marginLeft: '260px' }} onClick={() => {boughtGridRef.current.api.exportDataAsCsv();}}>Export</button>
                      </div>
                      <AgGridReact
                          ref={boughtGridRef}
                          rowData={inventory}
                          columnDefs={columnDefs}
                          defaultColDef={defaultColDef}
                      />
                  </div >
                  <div style={{ height: `calc(50px + (${inventory?.length} * 42px))`, width: '400px', marginLeft: '20px' }}>
                      <div style={{display: 'flex'}}>
                          <h1>Sold</h1>
                          <button style={{ marginLeft: '297px' }} onClick={() => {soldGridRef.current.api.exportDataAsCsv();}}>Export</button>
                      </div>
                      <AgGridReact
                          ref={soldGridRef}
                          rowData={soldInventory}
                          columnDefs={columnDefs}
                          defaultColDef={defaultColDef}
                      />
                  </div>
              </div>
              <div style={{ width: '1000px', height: `calc(50px + (${fifo?.length} * 42px))`, marginTop: '60px' }}>
                      <div style={{display: 'flex'}}>
                        <h1>FIFO</h1>
                        <button style={{ marginLeft: '896px' }} onClick={() => { fifoGridRef.current.api.exportDataAsCsv(); }}>Export</button>
                      </div>
                  <AgGridReact
                      ref={fifoGridRef}
                      rowData={fifo}
                      columnDefs={columnDefsAccounting}
                      defaultColDef={defaultColDef}
                      />
              </div>

              <div style={{ width: '1000px', height: `calc(50px + (${lifo?.length} * 42px))`, marginTop: '60px', marginBottom: '100px' }}>
                      <div style={{display: 'flex'}}>
                         <h1>LIFO</h1>
                        <button style={{ marginLeft: '896px' }} onClick={() => { lifoGridRef.current.api.exportDataAsCsv(); }}>Export</button>
                      </div>
                  <AgGridReact
                      ref={lifoGridRef}
                      rowData={lifo}
                      columnDefs={columnDefsAccounting}
                      defaultColDef={defaultColDef}
                  />
              </div>
          </div> : <h1>Navigate to Home and enter a public address</h1>}
    </div >
  )
}

export default Inventory