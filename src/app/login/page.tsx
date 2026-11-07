import { login, signup } from '@/app/auth/actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '1.5rem', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Campus Recruitment Portal</h2>
      {params.error && (
        <div style={{ padding: '0.75rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '1rem' }}>
          {params.error}
        </div>
      )}
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Email</label>
          <input id="email" name="email" type="email" required placeholder="student@example.com" style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Password</label>
          <input id="password" name="password" type="password" required placeholder="••••••••" style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button formAction={login} style={{ flex: 1, padding: '0.6rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Log in</button>
          <button formAction={signup} style={{ flex: 1, padding: '0.6rem', background: '#f3f4f6', color: '#1f2937', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}>Sign up</button>
        </div>
      </form>
    </div>
  );
}
