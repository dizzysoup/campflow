import { useEffect, useState } from 'react'
import { db } from './firebase' // 確保你的 firebase.js 導出了 db
import { collection, getDocs } from 'firebase/firestore'

function App() {
  const [status, setStatus] = useState('連線中...')

  useEffect(() => {
    // 建立一個非同步函數來測試讀取
    const testFirebase = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "test_collection"));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setStatus(`✅ 連線成功！從資料庫讀到：${data.status}`);
        } else {
          setStatus('⚠️ 連線成功，但資料庫裡沒東西喔！');
        }
      } catch (error) {
        console.error("Firebase Error:", error);
        setStatus(`❌ 連線失敗：${error.message}`);
      }
    };

    testFirebase();
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>🏕️ CampFlow 測試頻道</h1>
      <div style={{ 
        padding: '20px', 
        borderRadius: '8px', 
        background: status.includes('✅') ? '#d4edda' : '#f8d7da',
        color: status.includes('✅') ? '#155724' : '#721c24',
        display: 'inline-block'
      }}>
        {status}
      </div>
    </div>
  )
}

export default App