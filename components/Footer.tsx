
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white w-full">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} MindMate. All Rights Reserved.</p>
                <p className="mt-1">
                    MindMate is a supportive AI companion, not a replacement for professional medical advice.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
