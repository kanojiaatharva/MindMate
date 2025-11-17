
import React from 'react';

const About: React.FC = () => {
    return (
        <div className="space-y-6 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            <p>
                MindMate is an AI-powered mental health companion designed to provide a safe, accessible, and supportive space for everyone. Our mission is to reduce loneliness and support emotional well-being through personalized, empathetic interactions.
            </p>
            <p>
                We aim to bridge the gap in mental health support by offering a 24/7 companion that can help with early mood detection, provide evidence-based coping techniques, and encourage users to seek professional help when needed. We believe that technology, when designed with compassion and ethics at its core, can be a powerful tool for positive change.
            </p>

            <div className="!mt-8 pt-6 border-t">
                 <h3 className="text-xl font-semibold text-gray-800 mb-2">Disclaimer</h3>
                 <div className="text-sm p-4 bg-yellow-50 border border-yellow-200 rounded-lg" role="contentinfo">
                    <p>MindMate is an AI companion and not a substitute for professional medical advice, diagnosis, or treatment. It is not intended to be used for any medical purpose. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
                    <p className="mt-2">
                        <strong>If you are in a crisis or think you may have an emergency, please call 988 or your local emergency number immediately.</strong> Do not rely on this application for emergency medical needs.
                    </p>
                 </div>
            </div>
        </div>
    );
};

export default About;
