const MiniBars = ({ active = 0, inactive = 0 }) => {
  const maxValue = Math.max(active, inactive, 1)
  const bars = [
    { label: "Active", value: active, color: "bg-lime-300" },
    { label: "Inactive", value: inactive, color: "bg-slate-950" },
  ]

  return (
    <div className="mt-8 flex h-56 items-end justify-center gap-5 rounded-[1.5rem] bg-[#f8fafc] px-6 py-6">
      {Array.from({ length: 8 }).map((_, index) => {
        const activeHeight = Math.max(((active || 0) / maxValue) * 130, active ? 32 : 16) + (index % 3) * 8
        const inactiveHeight = Math.max(((inactive || 0) / maxValue) * 120, inactive ? 28 : 12) + ((index + 1) % 3) * 9

        return (
          <div className="flex items-end gap-1.5" key={index}>
            <div className="w-4 rounded-t-full bg-lime-300" style={{ height: `${Math.min(activeHeight, 160)}px` }} />
            <div className="w-4 rounded-t-full bg-slate-950" style={{ height: `${Math.min(inactiveHeight, 160)}px` }} />
          </div>
        )
      })}
    </div>
  )
}

export default MiniBars