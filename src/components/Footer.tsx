"use client"
import Link from 'next/link'
import { FaTwitter, FaLinkedin, FaGithub , FaHeart } from 'react-icons/fa'

export default function Footer() {
    return (
        <footer className='w-full bg-neutral-950 text-white py-6'>
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='flex gap-4'>
                        <Link href="https://x.com/DChhantbar" target="_blank" rel="noopener noreferrer">
                            <FaTwitter className='text-2xl hover:text-blue-400 transition-colors' />
                        </Link>
                        <Link href="https://www.linkedin.com/in/divyang-chhantbar-9828b91a5/" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin className='text-2xl hover:text-blue-600 transition-colors' />
                        </Link>
                        <Link href="https://github.com/divyang-chhantbar" target="_blank" rel="noopener noreferrer">
                            <FaGithub className='text-2xl hover:text-gray-400 transition-colors' />
                        </Link>
                    </div>
                    <div className='flex items-center gap-1'>
                        Made with <FaHeart className='text-red-500 mx-1' /> by Divyang
                    </div>
                    <div>
                        © 2025 FlowPost. All rights reserved
                    </div>
                </div>
            </div>
        </footer>
    )
}