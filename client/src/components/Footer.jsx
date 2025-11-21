import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
    return (
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-12 w-full text-gray-600 bg-white">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-300 pb-10">
                {/* Left Section */}
                <div className="md:max-w-md">
                    <img className="h-9" src={assets.logo} alt="logo" />
                    <p className="mt-6 text-sm leading-relaxed">
                        Experience the power of AI with QuickAI. Transform your content
                        creation with our suite of premium AI tools. Write articles,
                        generate images, and enhance your workflow.
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex flex-col md:flex-row md:justify-end gap-16">
                    {/* Company Links */}
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800 text-base">
                            Company
                        </h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#" className="hover:text-blue-600">Home</a></li>
                            <li><a href="#" className="hover:text-blue-600">About us</a></li>
                            <li><a href="#" className="hover:text-blue-600">Contact us</a></li>
                            <li><a href="#" className="hover:text-blue-600">Privacy policy</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h2 className="font-semibold text-gray-800 mb-5 text-base">
                            Subscribe to our newsletter
                        </h2>
                        <p className="text-sm mb-4 max-w-xs">
                            The latest news, articles, and resources, sent to your inbox weekly.
                        </p>
                        <div className="flex items-center gap-2">
                            <input
                                className="border border-gray-300 placeholder-gray-500 focus:ring-2 ring-blue-500 outline-none w-full max-w-xs h-9 rounded px-3"
                                type="email"
                                placeholder="Enter your email"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 w-28 h-9 text-white text-sm rounded">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Text */}
            <p className="pt-4 text-center text-xs md:text-sm pb-5">
                Copyright 2025 © <span className="text-gray-700 font-medium">QuickAI</span>. All Rights Reserved.
            </p>
        </footer>
    );
};

export default Footer;
