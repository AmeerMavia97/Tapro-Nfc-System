import { Download } from "lucide-react"

export const ActionButton = ({ children, icon: Icon, variant = "primary", ...props }) => (
  <button
    className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
      variant === "primary"
        ? "bg-slate-950 text-white shadow-lg shadow-slate-300/70 hover:-translate-y-0.5 hover:bg-slate-800"
        : "bg-white text-slate-700 ring-1 ring-black/5 hover:bg-[#f8fafc]"
    }`}
    type="button"
    {...props}
  >
    {Icon && <Icon className="size-4" />}
    {children}
  </button>
)

export const DataTable = ({ columns, rows, emptyText = "No data found." }) => (
  <div className="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-[#f8fafc] text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((column) => (
              <th className="px-5 py-4 font-bold" key={column.key}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td className="px-5 py-7 text-center text-slate-500" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr className="text-slate-700 transition hover:bg-[#f8fafc]/80" key={row.id}>
                {columns.map((column) => (
                  <td className="px-5 py-4" key={column.key}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)

export const ExportButton = ({ onClick }) => (
  <ActionButton icon={Download} onClick={onClick} variant="secondary">Export CSV</ActionButton>
)
