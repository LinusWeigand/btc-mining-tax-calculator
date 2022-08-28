import React, { useEffect, useState } from 'react';
import './Inventory.css';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

const Inventory = () => {
    const [inventory, setInventory] = useState(
        JSON.parse(localStorage.getItem('rowData'))?.filter(row => row.direction === 'IN') || null
    );
    const [soldInventory, setSoldInventory] = useState(
        JSON.parse(localStorage.getItem('rowData'))?.filter(row => row.direction === 'OUT') || null
    )
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

    const columnDefsSold = [
        ...columnDefs,
        {
            headerName: 'Bought at', field: 'bought-at'
        },
        {
            headerName: 'Profit / Loss', field: 'pl'
        }
    ]

    const defaultColDef = {
        sortable: true,
        filter: true,
        editable: true
    };

    const prepareData = () => {
        for (let i = 0; i < soldInventory.length; i++) {
            const row = soldInventory[i];

            const value = row.value;
            let tempInventory = inventory;
            const firstBought = tempInventory.shift();
            const firstBoughtValue = firstBought.value;
            const firstBoughtPrice = firstBought.price;
            
            if (firstBoughtValue >= value) {
                //einfacher case
                
            }

        }
    }

    useEffect(() => {
        console.log('(mount) inventory: ', inventory);
        console.log('(mount) soldInventory: ', soldInventory);
        
    }, []);
    
    useEffect(() => {
        console.log('(update) inventory: ', inventory);
        console.log('(update) soldInventory: ', soldInventory);
    }, [inventory, soldInventory]);

  return (
      <div className='ag-theme-alpine-dark' style={{width: '1400px', height: '1400px', display: 'flex'}}>
          LOL
          <div style={{ height: `calc(50px + (${inventory?.length} * 42px))`, width: '400px'}}>
          <AgGridReact
              
              rowData={inventory}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              />
          </div >
          <div style={{ height: `calc(50px + (${inventory?.length} * 42px))`, width: '800px'}}>
          <AgGridReact
              rowData={soldInventory}
              columnDefs={columnDefsSold}
              defaultColDef={defaultColDef}
              />
          </div>
          LOL2
    </div>
  )
}

export default Inventory