import React, { useState } from 'react';
import FacialExpression from './components/FacialExpression';
import Sons from './components/Sons';

const App = () => {
  const [Songs, setSongs] = useState([]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col md:flex-row">
      
      <div className="md:w-1/2 w-full flex items-center justify-center p-6">
        <FacialExpression setSongs={setSongs} />
      </div>
      <div className="md:w-1/2 w-full p-6 flex flex-col items-center md:items-start justify-start overflow-y-auto">
        <Sons Songs={Songs} />
      </div>
    </div>
  );
};

export default App;
