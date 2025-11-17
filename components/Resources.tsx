
import React from 'react';

const ResourceCard: React.FC<{ title: string; description: string; link?: string; linkText?: string; }> = ({ title, description, link, linkText }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
        <h3 className="font-bold text-lg text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 mb-3">{description}</p>
        {link && <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-semibold">{linkText || 'Learn more'} &rarr;</a>}
    </div>
);

const Resources: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Helpful Resources</h2>

            <section aria-labelledby="immediate-help-heading">
                <h3 id="immediate-help-heading" className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Immediate Help</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6" role="alert">
                    <h4 className="font-bold text-lg text-red-800 mb-2">If you are in a crisis, please seek help.</h4>
                    <p className="text-red-700">In India, you can contact the Kiran Mental Health Rehabilitation Helpline at 1800-599-0019. For users in the US and Canada, you can call or text 988. These services are free, confidential, and available 24/7.</p>
                </div>
            </section>
            
            <section aria-labelledby="coping-techniques-heading">
                 <h3 id="coping-techniques-heading" className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Coping Techniques</h3>
                <ResourceCard 
                    title="5-Minute Breathing Exercise"
                    description="A simple breathing exercise to calm anxiety and stress. Find a quiet place, close your eyes, and focus on your breath. Inhale slowly through your nose for 4 seconds, hold for 4 seconds, and exhale slowly through your mouth for 6 seconds. Repeat for 5 minutes."
                />
                <ResourceCard 
                    title="The 5-4-3-2-1 Grounding Technique"
                    description="A mindfulness exercise to bring you back to the present moment. Name 5 things you can see, 4 things you can feel, 3 things you can hear, 2 things you can smell, and 1 thing you can taste."
                />
            </section>

             <section className="mt-6" aria-labelledby="learn-more-heading">
                 <h3 id="learn-more-heading" className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Learn More</h3>
                 <ResourceCard 
                    title="About Cognitive Behavioral Therapy (CBT)"
                    description="CBT is a type of talk therapy that can help you manage your problems by changing the way you think and behave."
                    link="https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral"
                    linkText="Visit APA.org"
                />
                 <ResourceCard 
                    title="NAMI: National Alliance on Mental Illness"
                    description="NAMI is a leading mental health organization providing advocacy, education, support, and public awareness."
                    link="https://www.nami.org"
                    linkText="Visit NAMI.org"
                />
            </section>
        </div>
    )
}

export default Resources;