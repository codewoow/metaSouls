import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import Review from './components/Review';

function App() {
  const [currentView, setCurrentView] = useState('onboarding'); // 'onboarding' | 'review'
  const [userData, setUserData] = useState(null);
  const [reviewOther, setReviewOther] = useState(false);

  const handleReviewStart = (data) => {
    setUserData(data);
    setCurrentView('review');
    setReviewOther(false);
  };

  const handleBackToOnboarding = () => {
    setCurrentView('onboarding');
  };

  const handleReviewOtherQuestion = () => {
    // 重置 onboarding 到步骤 2（等级选择）
    setReviewOther(true);
    setCurrentView('onboarding');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'onboarding' ? (
        <Onboarding
          key={reviewOther ? 'review-other' : 'first-time'}
          onReviewStart={handleReviewStart}
          reviewOther={reviewOther}
        />
      ) : (
        <Review
          userData={userData}
          onBack={handleBackToOnboarding}
          onReviewOther={handleReviewOtherQuestion}
        />
      )}
    </div>
  );
}

export default App;
