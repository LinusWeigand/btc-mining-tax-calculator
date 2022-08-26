import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

const AddressForm = ( { handler } ) => {
    const [value, setValue] = React.useState(null);
    const [address, setAddress] = React.useState(null);
    const [counter, setCounter] = React.useState(0);
    
    React.useEffect(() => {
        console.log("handleSubmit");
        setAddress((cur) => value);
    }, [counter]);
    

    React.useEffect(() => {
        if (address !== null) {
            handler(address.title);
        }
    }, [address]);

  return (
    <Autocomplete
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
                  setCounter((cur) => cur + 1);
              }
          }}
          
      id="autocomplete"
      options={addresses}
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
  );
}

export default AddressForm;

const addresses = [
    { title: '1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv' },
];
