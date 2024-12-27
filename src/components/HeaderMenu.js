"use client"

import React, { useState } from "react";

export const HeaderMenu = ({ menuData }) => {
    const [open, setOpen] = useState({});
    const toggleMenu = (key) => {
        setOpen((prevState) => ({ ...prevState, [key]: !prevState[key] }));
    };

    console.log("kgo en todoo", Object.keys(menuData))
    return (
        <nav>
            <ul className="space-y-2">
                {Object.keys(menuData).map((continent) => (
                    <li key={continent}>
                        <div
                            className="flex items-center justify-between cursor-pointer hover:text-blue-600"
                            onClick={() => toggleMenu(continent)}
                        >
                            <span>{menuData[continent].name}</span>
                            <span
                                className={`transform transition-transform ${open[continent] ? "rotate-90" : ""
                                    }`}
                            >
                                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </span>
                        </div>
                        {open[continent] && (
                            <ul className="pl-4 space-y-2">
                                {Object.keys(menuData[continent].childs).map((country) => (
                                    <li key={country}>
                                        <div
                                            className="flex items-center justify-between cursor-pointer hover:text-blue-600"
                                            onClick={() => toggleMenu(`${continent}-${country}`)}
                                        >
                                            <span>{menuData[continent].childs[country].name}</span>
                                            <span
                                                className={`transform transition-transform ${open[`${continent}-${country}`] ? "rotate-90" : ""
                                                    }`}
                                            >
                                                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                                </svg>
                                            </span>
                                        </div>
                                        {open[`${continent}-${country}`] && (
                                            <ul className="pl-4 space-y-1">
                                                {menuData[continent].childs[country].childs.map((region) => (
                                                    <li key={region} className="hover:text-blue-600">
                                                        {region.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}