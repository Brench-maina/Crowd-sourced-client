export default function CreateResource() {
  return (
    <div className="tab-section">
      <h2>Create New Learning Resource</h2>
      <form className="create-form">
        <label>Resource Type</label>
        <select>
          <option>Video</option>
          <option>Article</option>
          <option>Tutorial</option>
        </select>

        <label>Title</label>
        <input type="text" placeholder="Enter resource title" />

        <label>Subject/Category</label>
        <input type="text" placeholder="e.g. Mathematics" />

        <label>Grade Level</label>
        <input type="text" placeholder="e.g. Beginner" />

        <label>Resource Link</label>
        <input type="url" placeholder="Paste your link..." />

        <button type="submit">Submit Resource</button>
      </form>
    </div>
  );
}
