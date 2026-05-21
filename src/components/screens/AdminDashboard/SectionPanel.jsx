import React from 'react'

export const SectionPanel = ({ children, description, title, className = "" }) => (
    <section className={`rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.055)] ${className}`}>
        <div className="mb-5">
            <h2 className="text-lg font-bold tracking-[-0.02em] text-slate-950">{title}</h2>
            {description && <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>}
        </div>
        {children}
    </section>
)
