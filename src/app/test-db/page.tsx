import { createClient } from '@/lib/supabase/server';

export default async function TestDbPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('students').select('*').limit(1);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Supabase Connection Status</h1>
      {error ? (
        <div style={{ color: 'red' }}>
          <p><strong>Status:</strong> Connection attempted, but returned an error/notice:</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      ) : (
        <div style={{ color: 'green' }}>
          <p><strong>Status:</strong> Connected successfully to Supabase!</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
