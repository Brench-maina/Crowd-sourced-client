export default function CreateResource() {
  return (
    <div className="create-resource-card">
      <h2 className="create-title">Create New Learning Resource</h2>

      <form className="create-form">
        <div className="form-group">
          <label>Resource Type</label>
          <select>
            <option value="">Choose resource type...</option>
            <option value="video">Video</option>
            <option value="article">Article</option>
            <option value="tutorial">Tutorial</option>
            <option value="quiz">Quiz</option>
          </select>
        </div>

        <div className="form-group">
          <label>Title</label>
          <input type="text" placeholder="Give your resource a catchy title..." />
        </div>

        <div className="form-group">
          <label>Subject/Category</label>
          <input type="text" placeholder="Select a subject..." />
        </div>

        <div className="form-group">
          <label>Grade Level</label>
          <input type="text" placeholder="Target grade level..." />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows="4"
            placeholder="Describe what students will learn from this resource..."
          ></textarea>
        </div>

        <div className="contributor-tips">
          <h3>💡 Contributor Tips:</h3>
          <ul>
            <li>Make content age-appropriate and engaging</li>
            <li>Include examples and practice exercises</li>
            <li>Use visuals and interactive elements when possible</li>
            <li>Earn XP based on views, ratings, and engagement!</li>
          </ul>
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            Submit for Review
          </button>
          <button type="button" className="draft-btn">
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
}
