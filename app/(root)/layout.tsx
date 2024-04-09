import Header from '@/components/Header'
import React from 'react'

const Rootlayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-[90%] mx-auto">
            <Header />
            {children}
        </div>
    )
}

export default Rootlayout