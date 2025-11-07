"use client"
import { RentalListing } from '@/lib/schemas/addRental'
import React from 'react'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"

import {EllipsisVertical} from "lucide-react"
import Link from 'next/link'
import { Button } from '../ui/button'

const MenuBar = ({ listing }: { listing: RentalListing }) => {
    const handleClick = () => {
        console.log('Delete', listing.id);
    }
    return (
        <Menubar >
            <MenubarMenu>
                <MenubarTrigger><EllipsisVertical className='size-6 text-white'/></MenubarTrigger>
                <MenubarContent className='flex justify-center items-center flex-col  bg-gray-900' >
                    <MenubarItem>
                       <Button> <Link href={`/edit/${listing.id}`}>Edit</Link></Button>
                    </MenubarItem>
                    <MenubarSeparator/>
                    <MenubarItem><Button onClick={handleClick}>Delete</Button></MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}

export default MenuBar
