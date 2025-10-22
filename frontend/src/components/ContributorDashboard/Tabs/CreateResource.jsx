import React, { useState } from "react";

const CreateResource = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    grade: "",
    description: "",
    link: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted resource:", formData);
  };

  const handleDraft = () => {
    console.log("Saved as draft:", formData);
  };

  return (
    <div className="create-resource-card">
      {/* Section Title */}
      <h2 className="form-title">Create Resource</h2>

      {/* Create Resource Form */}
      <form className="create-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Resource Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter resource title"
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select category</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="design">Design</option>
          <option value="tools">Tools</option>
        </select>

        <label htmlFor="grade">Grade Level</label>
        <select
          id="grade"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
        >
          <option value="">Select grade level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <label htmlFor="link">Resource Link</label>
        <input
          type="url"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
          placeholder="https://example.com"
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter a short description"
        ></textarea>

        {/* Contributor Tips Box */}
        <div className="contributor-tips">
          💡 <strong>Contributor Tips:</strong><br />
          Keep your resource title clear and descriptive.<br />
          Provide accurate details and links to help others easily find what they need.
        </div>

        {/* Form Buttons */}
        <div className="form-buttons">
          <button type="submit" className="submit-btn">Submit</button>
          <button type="button" className="draft-btn" onClick={handleDraft}>
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateResource;
