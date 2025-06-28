import React from 'react'

const NoResult = () => {
  return (
    <>
    <div className="noResult-container">
        <img src="src/icons/no-result.png" alt="City Not Found" className="noResult-img" />
        <h3 className="title">Something went wrong</h3>
        <p className="msg">
            We&apos;re unable to retrive the weather details. Ensure you&apos;ve entered a valid city or try again later.
        </p>
    </div>
    </>
  )
}

export default NoResult