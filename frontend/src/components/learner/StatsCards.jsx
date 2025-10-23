// StatsCards.jsx
export default function StatsCards() {
  return (
    <div className="stats-container">
      <div className="stat-card xp">
        <h2>2450</h2>
        <p>Learning XP</p>
        <span>Level 4</span>
      </div>
      <div className="stat-card">
        <h2>18</h2>
        <p>Courses Enrolled</p>
        <span>5 completed</span>
      </div>
      <div className="stat-card">
        <h2 style={{ color: "green" }}>87%</h2>
        <p>Avg Completion</p>
        <span>+3% this week</span>
      </div>
      <div className="stat-card">
        <h2>12</h2>
        <p>Badges Earned</p>
      </div>
    </div>
  );
}