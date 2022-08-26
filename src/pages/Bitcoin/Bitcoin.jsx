import './Bitcoin.css';
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useMemo, useState } from 'react';
import AddressForm from './../../components/AddressForm/AddressForm.tsx';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

//1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv
//1qAtZiyiJPrzfUQXiiVwvmMBm23tc5oaw

const Bitcoin = () => {
  const [rowData, setRowData] = useState();
  const [address, setAddress] = useState('');
  const [validAddress, setValidAddress] = useState(false);

  const columnDefs = [
    { headerName: 'Date', field: "block_time" },
    { headerName: 'Time', field: "block_time" },
    { headerName: 'Value', field: "balance_diff" },
    {
      headerName: 'Value In Euro', field: "valueInEuro",
      valueFormatter: (p) => `${Math.round(p.value * 100) / 100} €`
    },
    { headerName: 'IN/OUT', field: "inOrOut" },
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
      setRowData(result_json.data.list);
    }
  }

  const prepareData = async () => {

  }

  const getBtcPrice = async (timeStamp) => {
    const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=ETH&tsym=EUR&limit=1&toTs=${timeStamp}`);
    return await response.json();
  };

  const updateAddress = (adr) => {
    setAddress((cur) => adr);
  }

  useEffect(() => {
    if (address !== "") {
      fetchData(address)
    }
  }, [address]);

  return (
    <div className='ag-theme-alpine-dark' style={{ height: 600, width: 1400 }}>
      <AddressForm handler={updateAddress} />
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