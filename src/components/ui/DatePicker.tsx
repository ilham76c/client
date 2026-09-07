'use client';

import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type ViewMode = 'day' | 'month' | 'year';

type Props = {
  value: string;
  onChange: (val: string) => void;
  viewMode: ViewMode;
};

export default function DatePickerComponent({
  value,
  onChange,
  viewMode,
}: Props) {
  const views = {
    day: ['year', 'month', 'day'],
    month: ['year', 'month'],
    year: ['year'],
  };

  const openTo = {
    day: 'day',
    month: 'month',
    year: 'year',
  };

  const format = {
    day: 'DD MMMM YYYY',
    month: 'MMMM YYYY',
    year: 'YYYY',
  };

  return (
    <DatePicker
      views={views[viewMode] as any}
      openTo={openTo[viewMode] as any}
      value={dayjs(
        viewMode === 'day'
          ? value
          : viewMode === 'month'
            ? `${value}-01`
            : `${value}-01-01`,
      )}
      onChange={(newValue) => {
        if (!newValue) return;

        if (viewMode === 'day') {
          onChange(newValue.format('YYYY-MM-DD'));
        } else if (viewMode === 'month') {
          onChange(newValue.format('YYYY-MM'));
        } else {
          onChange(newValue.format('YYYY'));
        }
      }}
      format={format[viewMode]}
      closeOnSelect
      slotProps={{
        textField: {
          size: 'small',
          variant: 'outlined',

          sx: {
            minWidth: 200,

            '& .MuiOutlinedInput-root': {
              backgroundColor: '#1f2937',
              borderRadius: '10px',

              '& fieldset': {
                borderColor: '#4B5563',
              },

              '&:hover fieldset': {
                borderColor: '#6B7280',
              },

              '&.Mui-focused fieldset': {
                borderColor: '#3B82F6',
                borderWidth: '2px',
              },
            },

            '& .MuiInputBase-input': {
              color: '#F9FAFB',
              fontWeight: 500,
            },

            '& .MuiSvgIcon-root': {
              color: '#D1D5DB',
            },
          },
        },
      }}
    />
  );
}
