import React from "react";
// 1. Import the Drawer components instead of Sheet
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button"; // Assuming you installed button

const Tasks = () => {
    return (
        <div className="p-4 text-white h-full flex flex-col">
            {/* 2. Wrap everything in <Drawer> */}
            <Drawer>
                {/* YOUR TABLE HEADER */}
                <div className="grid grid-cols-4 text-gray-500 font-bold mb-4 border-b border-gray-800 pb-2">
                    <span>STATUS</span>
                    <span className="col-span-2">TASK</span>
                    <span>DATE</span>
                </div>

                {/* YOUR TASK LIST */}
                <div className="space-y-2">
                    <div className="group grid grid-cols-4 items-center bg-[#0f0f0f] p-3 rounded border border-gray-800 hover:border-gray-600 transition">
                        <span className="text-yellow-500 text-sm">
                            IN PROGRESS
                        </span>

                        {/* 3. The Trigger */}
                        <DrawerTrigger asChild>
                            <span className="col-span-2 cursor-pointer font-mono text-lg hover:underline hover:text-green-400">
                                MAKE BQ SITE
                            </span>
                        </DrawerTrigger>

                        <span className="text-gray-400 font-mono">
                            24/6/2025
                        </span>
                    </div>
                </div>

                {/* 4. THE DRAWER CONTENT (Slides up from bottom) */}
                <DrawerContent className="bg-black border-t border-gray-800 text-white max-h-[80vh]">
                    <div className="mx-auto w-full max-w-2xl">
                        <DrawerHeader>
                            <DrawerTitle className="text-3xl font-mono uppercase">
                                MAKE BQ SITE
                            </DrawerTitle>
                            <DrawerDescription className="text-gray-500">
                                Task Details
                            </DrawerDescription>
                        </DrawerHeader>

                        <div className="p-4 space-y-4 font-mono">
                            {/* Your Form Inputs */}
                            <div>
                                <label className="text-xs text-gray-500 uppercase block mb-2">
                                    Notes
                                </label>
                                <textarea
                                    className="w-full h-32 bg-[#111] border border-gray-800 p-3 rounded text-white focus:outline-none"
                                    placeholder="Brain dump here..."
                                />
                            </div>
                        </div>

                        <DrawerFooter>
                            <Button className="bg-white text-black hover:bg-gray-200">
                                Save Changes
                            </Button>
                            <DrawerClose asChild>
                                <Button
                                    variant="outline"
                                    className="border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white"
                                >
                                    Cancel
                                </Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default Tasks;
