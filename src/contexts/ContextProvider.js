import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
    const [columnDefsBitcoin, setcolumnDefsBitcoin] = useState([
        { headerName: 'Date', field: "date", sortable: true, filter: true, editable: true},
        { headerName: 'Time', field: "time", sortable: true, filter: true, editable: true },
        { headerName: 'Value', field: "value", sortable: true, filter: true, editable: true },
        { headerName: 'Value In Euro', field: "valueInEuro" ,valueFormatter: (p) => `${Math.round(p.value * 100) / 100} €`, sortable: true, filter: true, editable: true },
        { headerName: 'IN/OUT', field: "inOrOut", sortable: true, filter: true, editable: true},
        { headerName: 'Txn Hash', field: "block_hash", sortable: true, filter: true, editable: true },
        { headerName: 'Txn Fee', field: "fee", valueFormatter: (p) => p.value + " BTC", sortable: true, filter: true, editable: true },
        { headerName: 'Fee in Euro', field: "feeInEuro", valueFormatter: (p) => `${Math.round(p.value * 100) / 100} €`, sortable: true, filter: true, editable: true },
    ]);
    const [rowDataBitcoin, setRowDataBitcoin] = useState([]);

    const [balance, setBalance] = useState([]);

    const [address, setAddress] = useState("");

    return (
        <StateContext.Provider
            value={{
                columnDefsBitcoin, setcolumnDefsBitcoin,
                rowDataBitcoin, setRowDataBitcoin,
                balance, setBalance,
                address, setAddress
            }}>
            {children}
        </ StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);