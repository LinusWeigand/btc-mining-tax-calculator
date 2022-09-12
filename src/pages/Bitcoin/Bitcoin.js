import './Bitcoin.css';
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from 'react';
import AddressForm from '../../components/AddressForm/AddressForm.js';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useRef } from 'react';



const Bitcoin = () => {
  const [rowData, setRowData] = useState(
    JSON.parse(localStorage.getItem('rowData')) || null
  );
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(
    JSON.parse(localStorage.getItem('balance')) || null
  );
  const [btcPrice, setBtcPrice] = useState(
    JSON.parse(localStorage.getItem('btcPrice')) || null
  );
  const gridRef = useRef();

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
    { headerName: 'Txn Fee', field: "fee", valueFormatter: (p) => p.value + " BTC" },
    {
      headerName: 'Fee in Euro', field: "feeInEuro",
      valueFormatter: (p) => `${Math.round(p.value * 100) / 100} €`
    },
    { headerName: 'Txn Hash', field: "hash" },
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
      setRowData(null);
      localStorage.setItem('rowData', JSON.stringify(null));
      alert("not a valid address");
    } else {
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
        row.price = price;
        row.date = new Date(Number(timestamp * 1000)).toISOString().split('T')[0];
        row.time = new Date(Number(timestamp * 1000)).toISOString().split('T')[1].split('.')[0];
        row.timestamp = timestamp;
        row.value = satsToBtc(row.balance_diff);
        row.direction = row.value > 0 ? 'IN' : 'OUT';
        row.valueInEuro = row.value * price;
        row.fee = satsToBtc(row.fee);
        row.feeInEuro = price * row.fee;

        result.push(row);
      }
    }
    localStorage.setItem('rowData', JSON.stringify(result));
    setRowData(result);
  }

  const getBtcPrice = async (timeStamp) => {
    const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=EUR&limit=1&toTs=${timeStamp}`);
    return await response.json();
  };

  const getCurrentBtcPrice = async () => {
    const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=EUR&limit=1&toTs=${Date.now()}`);
    const respone_json = await response.json();
    const price = respone_json.Data.Data[1].close;
    setBtcPrice(price);
    localStorage.setItem('btcPrice', JSON.stringify(price));
  }

  const satsToBtc = (sats) => {
    return sats / Math.pow(10, 8);
  };

  const getBalance = async (address) => {
    const result = await fetch(`https://blockchain.info/q/addressbalance/${address}`);
    const result_json = await result.json();
    if (result_json === null) {
      setBalance(null);
      localStorage.setItem('balance', JSON.stringify(null));
    } else {
      setBalance(satsToBtc(result_json));
      localStorage.setItem('balance', JSON.stringify(satsToBtc(result_json)));
    }
  }

  const onButtonExport = () => {
    gridRef.current.api.exportDataAsCsv();
  }

  useEffect(() => {
    if (address !== "") {
      fetchData(address)
      getBalance(address)
    }
  }, [address]);

  useEffect(() => {
    getCurrentBtcPrice();
  }, []);


  return (
    <div className='ag-theme-alpine-dark' style={{ height: `calc(50px + (${rowData?.length} * 42px))`, width: 'calc(100% - 250px)' }}>
      <div style={{display: 'flex'}} >
        <AddressForm handler={setAddress} className='addressform' />
        {rowData !== null &&
          <div style={{display: 'flex'}}>
          <h1 style={{ padding: '30px 0px 30px 30px' }}>
          Balance:
          </h1>
          <h2 style={{padding: '35px 0px 30px 10px'}}>
            {balance ?? 0} BTC / {Math.round(balance * btcPrice * 100) / 100} €
            </h2>
          <button onClick={onButtonExport} style={{margin: '35px 0px 30px 100px'}}>Export</button>
        </div>
        }
      </div>
      {rowData !== null &&
        <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs} 
        defaultColDef={defaultColDef}
        />
      }
      
      </div>
  );
}

export default Bitcoin;

//1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv
//1qAtZiyiJPrzfUQXiiVwvmMBm23tc5oaw
