import { useState } from 'react'
import InjuryTracker from './components/InjuryTracker'
import InjuryTrackerDemo from './components/InjuryTrackerDemo'

function App() {
  const [version, setVersion] = useState('demo') // 'demo' or 'full'

  return (
    <>
      {/* Version Selector - Remove in production or when you only want one version */}
      <div className="fixed top-4 right-4 z-50">
        <select
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg font-semibold text-sm"
        >
          <option value="demo">Demo Mode (No Backend)</option>
          <option value="full">Full Version (Yahoo API)</option>
        </select>
      </div>

      {/* Render selected version */}
      {version === 'demo' ? <InjuryTrackerDemo /> : <InjuryTracker />}
    </>
  )
}

export default App
