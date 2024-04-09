"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const Header = () => {
    const { user, isLoaded } = useUser();
    return (
        <header className='py-8 container flex items-center justify-between font-mono'>
            <div className='text-3xl'>
                <h1>&lt; <span>passMan</span> /&gt;</h1>
            </div>
            {isLoaded ? (
                <div className='flex gap-4 items-center'>
                    <div className='scale-125' >
                        <UserButton />
                    </div>
                    <Link target='_blank' href="https://github.com/ditinagrawal/passman"><Button>Github</Button></Link>
                </div>
            ) : (<Loader2 className="animate-spin" />)}
        </header>
    )
}

export default Header