import './Bitcoin.css';
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from 'react';
import AddressForm from '../../components/AddressForm/AddressForm.js';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

//1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv
//1qAtZiyiJPrzfUQXiiVwvmMBm23tc5oaw

const Bitcoin = () => {
  const [rowData, setRowData] = useState();
  const [address, setAddress] = useState('');
  const [validAddress, setValidAddress] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [soldInventory, setSoldInventory] = useState([]);

  const columnDefs = [
    { headerName: 'Date', field: "date" },
    { headerName: 'Time', field: "time" },
    {
      headerName: 'Value', field: "value",
      valueFormatter: (p) => `${p.value} BTC`
    },
    {
      headerName: 'Value In Euro', field: "valueInEuro",
      valueFormatter: (p) => `${Math.round(p.value * 100) / 100} €`
    },
    { headerName: 'IN/OUT', field: "direction" },
    { headerName: 'Txn Hash', field: "block_hash" },
    { headerName: 'Txn Fee', field: "fee", valueFormatter: (p) => p.value + " BTC" },
    {
      headerName: 'Fee in Euro', field: "feeInEuro",
      valueFormatter: (p) => `${Math.round(p.value * 100) / 100} €`
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    editable: true
  };

  const fetchData = async (address) => {
    const result = await fetch(`https://chain.api.btc.com/v3/address/${address}/tx`);
    const result_json = await result.json();
    if (result_json.data === null) {
      setValidAddress(false);
      alert("not a valid address");
    } else {
      setValidAddress(true);
      prepareData(result_json.data.list);
    }
  }

  const prepareData = async (data) => {
    let result = [];

    for (let i = 0; i < data.length; i++) {
      let row = data[i];
      const timestamp = row.block_time;
      const btcPrice = await getBtcPrice(timestamp);

      if (btcPrice.Data.Data) {
        const price = btcPrice.Data.Data[1].close;
        row.date = new Date(Number(timestamp * 1000)).toISOString().split('T')[0];
        row.time = new Date(Number(timestamp * 1000)).toISOString().split('T')[1].split('.')[0];
        row.timestamp = timestamp;
        row.value = satsToBtc(row.balance_diff);
        row.direction = row.value > 0 ? 'IN' : 'OUT';
        row.valueInEuro = row.value * price;
        row.fee = satsToBtc(row.fee);
        row.feeInEuro = price * row.fee;

        result.push(row);

        if (row.direction === 'IN') {
          setInventory((values) => [...values, { value: row.value, price: price }]);
        } else {
          setSoldInventory((values) => [...values, { value: row.value, price: price }]);
        }
      }
    }
    setRowData(result);
  }

  const getBtcPrice = async (timeStamp) => {
    const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=EUR&limit=1&toTs=${timeStamp}`);
    return await response.json();
  };

  const satsToBtc = (sats) => {
    return sats / Math.pow(10, 8);
  };

  useEffect(() => {
    if (address !== "") {
      fetchData(address)
    }
  }, [address]);

  return (
    <div className='ag-theme-alpine-dark' style={{ height: 600, width: 1400 }}>
      <AddressForm handler={setAddress} className='addressform'/>
      {validAddress && <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs} 
        defaultColDef={defaultColDef}
        />
      }
      <br />
      
    </div>
  );
}

export default Bitcoin;

//1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv
//1qAtZiyiJPrzfUQXiiVwvmMBm23tc5oaw