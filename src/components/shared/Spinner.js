/**
 *
 * No Item
 *
 */

import React from 'react'

export const Spinner = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <h4
        style={{
          border: '6px solid #f3f3f3',
          borderRadius: '50%',
          borderTop: '6px solid #3498db',
          width: '50px',
          height: '50px',
          WebkitAnimation: 'spin 0.5s linear infinite', /* Safari */
          animation: 'spin 0.5s linear infinite'
        }}
      >
        <style>
          {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          `}
        </style>
      </h4>
    </div>
  )
}

Spinner.propTypes = {}
