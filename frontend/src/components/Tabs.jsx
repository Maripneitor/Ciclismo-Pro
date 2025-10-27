import { useState } from 'react';
import './Tabs.css';

function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tabs">
      <div className="tab-list">
        {children.map((child, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {children[activeTab]}
      </div>
    </div>
  );
}

export default Tabs;