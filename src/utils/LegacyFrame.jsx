import React from 'react';

export default function LegacyFrame({ src, title }) {
  return (
    <iframe
      title={title}
      src={src}
      style={{
        border: '0',
        width: '100%',
        height: '100vh',
        display: 'block',
        background: '#06070e',
      }}
    />
  );
}
