import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Jerisom Trade | Institutional Trading';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  // Load logo from public/assets
  // Using an absolute URL for the image
  const logoUrl = new URL('../public/assets/jerisom.png', import.meta.url).toString();

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #020617, #0f172a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '80px',
        }}
      >
        {/* Abstract Background Design */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '60%',
            height: '120%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
            transform: 'rotate(-15deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '50%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            padding: '60px 80px',
            borderRadius: '48px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Brand Mark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '30px',
                background: 'rgba(255, 255, 255, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                padding: '15px',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                style={{
                  fontSize: '72px',
                  fontWeight: 900,
                  color: 'white',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                JERISOM <span style={{ color: '#10b981' }}>TRADE</span>
              </span>
            </div>
          </div>

          {/* Tagline */}
          <h2
            style={{
              fontSize: '38px',
              fontWeight: 700,
              color: '#94a3b8',
              textAlign: 'center',
              margin: 0,
              maxWidth: '850px',
              lineHeight: 1.4,
            }}
          >
            Institutional-Grade Crypto Trading Infrastructure for Professional Investors
          </h2>

          {/* Stats / Features */}
          <div
            style={{
              display: 'flex',
              gap: '60px',
              marginTop: '48px',
            }}
          >
            {[
              { label: 'Latency', value: '< 1ms' },
              { label: 'Uptime', value: '99.99%' },
              { label: 'Liquidity', value: 'Institutional' },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  {stat.label}
                </span>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'white' }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Accents */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#475569',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
          }}
        >
          Secure • Regulated • Professional
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
