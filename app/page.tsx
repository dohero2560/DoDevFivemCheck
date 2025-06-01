import FivemChecker from "@/components/fivem-checker"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">FIVEMCHECK - FiveM Player Identifier & Server Checker</h1>
          <p className="text-gray-400 mb-4">The #1 FiveM Tools for Checking Player IDs and Server Information</p>
          
          {/* SEO Content */}
          <div className="max-w-3xl mx-auto text-left text-gray-300 mt-8 p-6 bg-white/5 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">FIVEMCHECK - Your Ultimate FiveM Tools</h2>
            <p className="mb-4">
              FIVEMCHECK is the premier FiveM player identifier and server checker tool. Instantly verify player IDs, 
              check server status, and access detailed player information for any FiveM server.
            </p>
            <h3 className="text-xl font-semibold mb-3">Key Features:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Real-time FiveM player identifier lookup</li>
              <li>Comprehensive server information checker</li>
              <li>Instant player ID verification</li>
              <li>Server status monitoring</li>
              <li>Detailed player analytics</li>
            </ul>
            <p className="text-sm text-gray-400">
              Trusted by thousands of FiveM server owners and players worldwide. The most reliable FiveM tools for 
              server management and player verification.
            </p>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <FivemChecker />
        </div>
      </div>
    </main>
  )
}

