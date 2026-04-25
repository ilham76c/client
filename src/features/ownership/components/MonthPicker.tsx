import { useState } from "react";

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

export default function MonthPicker({ value, onChange }: any) {
  const [open, setOpen] = useState(false);

  const [year, month] = value.split("-").map(Number);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-[#0f1b2d] border border-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        {months[month - 1]} {year}
        <span>📅</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 bg-[#0b1422] border border-gray-700 rounded-xl p-4 shadow-xl z-50 w-64">
          
          {/* Year */}
          <div className="flex justify-between items-center mb-3">
            <button onClick={() => onChange(`${year - 1}-${String(month).padStart(2,'0')}`)}>◀</button>
            <span className="font-semibold">{year}</span>
            <button onClick={() => onChange(`${year + 1}-${String(month).padStart(2,'0')}`)}>▶</button>
          </div>

          {/* Months */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((m, i) => (
              <button
                key={m}
                onClick={() => {
                  onChange(`${year}-${String(i + 1).padStart(2, "0")}`);
                  setOpen(false);
                }}
                className={`
                  px-2 py-1 rounded-md text-sm
                  ${i + 1 === month 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-300 hover:bg-gray-700"}
                `}
              >
                {m.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}