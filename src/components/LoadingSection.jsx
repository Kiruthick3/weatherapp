import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingSection = () => {
  return (
   <>
    <div className="loadingText">
        <DotLottieReact
        src="https://lottie.host/df3f4f76-ad10-49f9-976c-aa9e91936e3d/utZHbmQvEF.json"
        loop
        autoplay
        />
        <h4>loading... Please wait!</h4>
    </div>
   </>
  )
}

export default LoadingSection