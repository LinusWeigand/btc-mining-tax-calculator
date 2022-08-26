import { ChangeEvent, FormEvent, useState } from 'react';
import React from 'react';
import './AddressForm.css';

const AddressForm = (props: { handler: (address: string) => void }) => {

    const [values, setValues] = useState({
        address: '1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.handler(values.address)
    }

    const handleAddressInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setValues((values) => ({
            ...values,
            address: e.target.value
        }))
    };

    return (
        <div className='Form'>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    id='public-key'
                    className='formField'
                    placeholder='Public Address, e.g. 1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv'
                    name='address'
                    value={values.address}
                    onChange={handleAddressInputChange}
                    autoFocus
                />
            </form>
        </div>
    );
}

export default AddressForm;