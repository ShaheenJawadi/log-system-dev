import { Theme  } from '@mui/material/styles';

const TextFieldOverrides = (theme: Theme) => {
 

    return {
        MuiFormControl: { 
            styleOverrides: {
              root: {
                width: '100%', 
              },
            },
          },
        MuiOutlinedInput: {
            
            styleOverrides: {
                root: {
                 
                    backgroundColor: 'white',
                    '&.Mui-disabled': {
                        backgroundColor: theme.palette.action.disabledBackground,
                    },
                    
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.secondary.main,
                    }
                },
                notchedOutline: {
                    borderColor: theme.palette.divider,
                },
              
                error: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.error.main,
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: theme.palette.secondary.main,
                    
                    '&.Mui-focused': {
                        color: theme.palette.secondary.main,
                    },
                    '&.Mui-error': {
                        color: theme.palette.error.main,
                    },
                    '&.Mui-disabled': {
                        color: theme.palette.text.disabled,
                    },
                },
            },
        },
    };
};

export default TextFieldOverrides;