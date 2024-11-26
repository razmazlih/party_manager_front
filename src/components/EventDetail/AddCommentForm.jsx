import React, { useState } from 'react';

const AddCommentForm = ({ onAdd }) => {
    const [commentText, setCommentText] = useState('');

    const handleAddComment = () => {
        onAdd(commentText);
        setCommentText('');
    };

    return (
        <div className="add-comment-section">
            <h2>Add a Comment</h2>
            <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment here"
            ></textarea>
            <button onClick={handleAddComment}>Add Comment</button>
        </div>
    );
};

export default AddCommentForm;