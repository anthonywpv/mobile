import React from 'react';

interface CommonProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function Title({ children, style, className }: CommonProps) {
  return (
    <h2
      className={className}
      style={{
        color: 'var(--text-dark)',
        fontSize: '1.25rem',
        fontWeight: '700',
        textAlign: 'left',
        marginBottom: '1.25rem',
        borderLeft: '5px solid var(--color-primary)', 
        paddingLeft: '12px',
        lineHeight: '1.2',
        ...style 
      }}
    >
      {children}
    </h2>
  );
}


interface ContainerProps extends CommonProps {
  container?: boolean;
}

export function Container({ children, style, className, container = true }: ContainerProps) {
  const baseClass = container ? 'myContainer' : '';
  
  return (
    <div
      className={`${baseClass} ${className || ''}`}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        ...style 
      }}
    >
      {children}
    </div>
  );
}