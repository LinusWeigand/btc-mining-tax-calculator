import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import './AddressForm.css';

const filter = createFilterOptions();

const AddressForm = ( { handler } ) => {
  const [value, setValue] = React.useState(
      JSON.parse(localStorage.getItem('value')) || null
    );
    const [address, setAddress] = React.useState(null);
    const [addresses, setAddresses] = React.useState(
        JSON.parse(localStorage.getItem('addresses')) || []
    );

    React.useEffect(() => {
        
        if (address !== null) {
          handler(address.title);
          localStorage.setItem('value', JSON.stringify(value));
            
            if (addresses.filter(adr => adr.title === address.title).length === 0) {
                setAddresses(cur => [...cur, address]);
                localStorage.setItem('addresses', JSON.stringify(addresses.concat([{title: address.title}])));
            }
        }
    }, [address]);

    return (
        <div>
      <Autocomplete
          className='formField'
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            title: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            title: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.title);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
          });
        }

        return filtered;
          }}
          selectOnFocus
          autoHighlight
          autoSelect
          clearOnBlur
          handleHomeEndKeys
          onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setAddress((cur) => value);
              }
          }}
          
      id="autocomplete"
      options={addresses.map((option) => option)}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.title;
      }}
      renderOption={(props, option) => <li {...props}>{option.title}</li>}
      sx={{ width: 600 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label="Public Address" />
      )}
            />
            </div>
  );
}

export default AddressForm;


