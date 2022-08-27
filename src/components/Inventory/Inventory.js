import React from 'react'

const Inventory = ({ inventory, soldInventory }) => {
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

    const defaultColDef = {
        sortable: true,
        filter: true,
        editable: true
    };

  return (
      <div>
          
    </div>
  )
}

export default Inventory