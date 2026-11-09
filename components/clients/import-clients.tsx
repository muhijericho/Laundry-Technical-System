'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import * as XLSX from 'xlsx'

export function ImportClients() {
  const [loading, setLoading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const reader = new FileReader()
    
    reader.onload = async (evt) => {
      const bstr = evt.target?.result
      const wb = XLSX.read(bstr, { type: 'binary' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      // Read data as array of arrays
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][]

      const clientsToImport = []
      
      // Loop through rows (skip index 0 if it's the header row)
      // Based on your Excel: 
      // Column 0: Index (1, 2, 3...)
      // Column 1: Shop Name
      // Column 2: City
      // Column 3: Complete Address
      // Column 4: Contact Person
      // Column 5: Contact Numbers
      // Column 6: Installation Team Assigned
      // Column 7: Turn Over Date
      // Column 8: PMS DATE
      // Column 9: PMS STATUS
      for (let i = 1; i < data.length; i++) {
        const row = data[i]
        // Only import if Shop Name exists (column 1)
        if (row && row[1]) {
          const pmsStatusValue = String(row[9] || '').toLowerCase().trim()
          clientsToImport.push({
            name: String(row[1] || ''),  // Shop Name
            city: String(row[2] || ''),  // City
            address: String(row[3] || ''),  // Complete Address
            contactPerson: String(row[4] || ''),  // Contact Person
            contactNumber: String(row[5] || ''),  // Contact Numbers
            installer: String(row[6] || ''),  // Installation Team
            pmsStatus: pmsStatusValue === 'done' ? 'done' : 'pending'
          })
        }
      }

      // Send data to API
      await fetch('/api/clients/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clients: clientsToImport })
      })
      
      setLoading(false)
      window.location.reload() // Refresh page to show new clients
    }
    
    reader.readAsBinaryString(file)
  }

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
        <Upload className="h-5 w-5 mr-2" />
        {loading ? 'Importing...' : 'Import Excel'}
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFileUpload} 
          className="hidden" 
          disabled={loading}
        />
      </label>
    </div>
  )
}