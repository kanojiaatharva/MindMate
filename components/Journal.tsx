
import React, { useState, useEffect } from 'react';

const Journal: React.FC = () => {
  const [entry, setEntry] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedEntry = localStorage.getItem('mindmate_journal_entry');
    if (savedEntry) {
      setEntry(savedEntry);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('mindmate_journal_entry', entry);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000); // Hide message after 2s
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntry(e.target.value);
    if(isSaved) setIsSaved(false);
  }

  return (
    <div className="flex flex-col h-full">
      <p className="text-gray-600 mb-4">
        Journaling can be a powerful tool for processing thoughts and emotions. Write whatever comes to mind. This is your private space, and your entries are saved only on this device.
      </p>
      <textarea
        value={entry}
        onChange={handleTextChange}
        className="flex-1 w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
        placeholder="Start writing..."
        aria-label="Journal Entry"
      />
      <div className="mt-4 flex justify-end items-center">
        {isSaved && <span className="text-green-600 mr-4 transition-opacity" role="status">Saved!</span>}
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          Save Entry
        </button>
      </div>
    </div>
  );
};

export default Journal;
