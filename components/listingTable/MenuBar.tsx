import { AddRentalSchema } from '@/lib/schemas/addRental'
import React from 'react'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

import {EllipsisVertical} from "lucide-react"
import Link from 'next/link'
import { Button } from '../ui/button'

const MenuBar = ({ listing }: { listing: AddRentalSchema }) => {
    const handleClick = () => {
        console.log('Delete', listing.id);
    }
    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger><EllipsisVertical className='size-6 text-white'/></MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <Link href={`/edit/${listing.id}`}></Link><MenubarShortcut>⌘T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator/>
                    <MenubarItem><Button onClick={handleClick}>Delete</Button></MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}

export default MenuBar
