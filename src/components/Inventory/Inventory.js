import React, { useEffect, useState } from 'react';
import './Inventory.css';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

const Inventory = () => {
    const [inventory, setInventory] = useState(
        JSON.parse(localStorage.getItem('rowData')).filter(row => row.direction === 'IN') || null
    );
    const [soldInventory, setSoldInventory] = useState(
        JSON.parse(localStorage.getItem('rowData')).filter(row => row.direction === 'OUT') || null
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
      <div className='ag-theme-alpine-dark inventory'>
          LOL
          <AgGridReact
              rowData={inventory}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
          />
          <AgGridReact
              rowData={soldInventory}
              columnDefs={columnDefsSold}
              defaultColDef={defaultColDef}
          />
          LOL2
    </div>
  )
}

export default Inventory