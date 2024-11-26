import React from 'react';

const CommentsSection = ({ comments, userId, onDelete }) => {
    return (
        <div className="comments-section">
            <h2>Comments</h2>
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        <p><strong>{comment.username}:</strong> {comment.content}</p>
                        {comment.user === parseInt(userId) && (
                            <button 
                                onClick={() => onDelete(comment.id)} 
                                className="delete-button"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    );
};

export default CommentsSection;