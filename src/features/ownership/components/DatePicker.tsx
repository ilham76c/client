'use client';

import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type Props = {
  value: string; // "YYYY-MM"
  onChange: (val: string) => void;
};

export default function MonthPicker({ value, onChange }: Props) {
  return (
    <DatePicker
    views={['year', 'month']}
    value={dayjs(value + '-01')}
    onChange={(newValue) => {
      if (!newValue) return;
      onChange(newValue.format('YYYY-MM'));
    }}
    format="MMMM YYYY"
    closeOnSelect
    slotProps={{
      textField: {
        size: 'small',
        variant: 'outlined', // 🔥 penting

        sx: {
          minWidth: 200,

          // 🔥 ROOT INPUT
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1f2937', // 🔥 lebih terang
            borderRadius: '10px',

            // default border
            '& fieldset': {
              borderColor: '#4B5563',
            },

            // hover
            '&:hover fieldset': {
              borderColor: '#6B7280',
            },

            // focus
            '&.Mui-focused fieldset': {
              borderColor: '#3B82F6',
              borderWidth: '2px',
            },
          },

          // 🔥 TEXT
          '& .MuiInputBase-input': {
            color: '#F9FAFB',
            fontWeight: 500,
          },

          // 🔥 ICON
          '& .MuiSvgIcon-root': {
            color: '#D1D5DB',
          },
        },
      },
    }}
  />
  );
}