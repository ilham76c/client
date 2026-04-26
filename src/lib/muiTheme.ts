import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },

  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '10px',

          '& fieldset': {
            borderColor: '#FFFFFF',
          },

          '&:hover fieldset': {
            borderColor: '#D1D5DB',
          },

          '&.Mui-focused fieldset': {
            borderColor: '#3B82F6',
          },
        },

        input: {
          color: '#FFFFFF',
          WebkitTextFillColor: '#FFFFFF',
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          color: '#FFFFFF',
        },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#0b1422',
        },
      },
    },
  },
});