import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:4000';

export default function App() {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const socket = useMemo(() => io(API_URL, { autoConnect: false }), []);

  useEffect(() => {
    socket.connect();

    socket.on('job-progress', (payload) => {
      if (String(payload.jobId) !== String(jobId)) {
        return;
      }

      setProgress(payload.insertedCount || 0);

      if (payload.error) {
        setStatus('failed');
        setError(payload.error);
      } else if (payload.done) {
        setStatus('done');
      } else {
        setStatus('running');
      }
    });

    return () => {
      socket.off('job-progress');
      socket.disconnect();
    };
  }, [socket, jobId]);

  const startMigration = async () => {
    if (!file) return;

    setProgress(0);
    setError('');
    setStatus('running');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const newJobId = response.data.jobId;
      setJobId(String(newJobId));
      socket.emit('join-job', String(newJobId));
    } catch (requestError) {
      setStatus('failed');
      setError(requestError?.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <main className="container">
      <h1>Database Migration App</h1>

      <input
        type="file"
        accept=".csv"
        onChange={(event) => setFile(event.target.files?.[0] || null)}
      />

      <button type="button" onClick={startMigration} disabled={!file || status === 'running'}>
        Start
      </button>

      <p>Status: {status}</p>
      <p>Job: {jobId || '-'}</p>
      <p>Rows inserted: {progress}</p>
      {error && <p className="error">Error: {error}</p>}
    </main>
  );
}
