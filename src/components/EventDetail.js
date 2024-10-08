import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEventDetail, createReservation, fetchComments, createComment, deleteComment } from '../services/api';
import './styles.css';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // הגדרת useNavigate
    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState(1);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchEventDetail(id).then((response) => {
            setEvent(response.data);
        });

        fetchComments(id).then((response) => {
            setComments(response.data);
        });
    }, [id]);

    const handleReservation = () => {
        if (!userId) {
            alert('Please log in to make a reservation.');
            return;
        }

        const reservationData = {
            user: userId,
            event: event.id,
            seats_reserved: seats,
        };

        createReservation(reservationData).then(() => {
            alert('Reservation created successfully!');
            navigate('/my-reservations');
        }).catch((error) => {
            console.error('Error creating reservation:', error);
            alert('Failed to create reservation. Please check the input.');
        });
    };

    const handleAddComment = () => {
        if (!userId) {
            alert('Please log in to add a comment.');
            return;
        }
    
        if (comments.some(comment => comment.user === userId)) {
            alert('You have already added a comment for this event.');
            return;
        }
    
        const commentData = {
            event: id,
            content: commentText,
            user: userId
        };
    
        createComment(commentData).then(() => {
            alert('Comment added successfully!');
            fetchComments(id).then((response) => {
                setComments(response.data);
            });
        }).catch((error) => {
            console.error('Error adding comment:', error);
            alert('Failed to add comment.');
        });
    };

    const handleDeleteComment = (commentId) => {
        deleteComment(commentId).then(() => {
            alert('Comment deleted successfully!');
            fetchComments(id).then((response) => {
                setComments(response.data);
            });
        }).catch((error) => {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment.');
        });
    };

    if (!event) return <div>Loading...</div>;

    const eventDateLocal = new Date(event.date).toLocaleString(); // ממיר את הזמן לזמן מקומי

    return (
        <div>
            <h1>{event.name}</h1>
            <p>{event.description}</p>
            <p>Location: {event.location}</p>
            <p>Date: {eventDateLocal}</p>
            <p>Price: {event.price}</p>
            <p>Available Places: {event.available_places}</p>
            <div>
                <label>
                    Seats:
                    <input
                        type="number"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                        min="1"
                        max={event.available_places}
                    />
                </label>
                <button onClick={handleReservation}>Reserve</button>
            </div>
            
            {/* הצגת התגובות */}
            <div className="comments-section">
                <h2>Comments</h2>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <p><strong>{comment.username}:</strong> {comment.content}</p>
                            {comment.user === parseInt(userId) && (
                                <button 
                                    onClick={() => handleDeleteComment(comment.id)} 
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

            {/* הוספת תגובה - יוצג רק אם המשתמש מחובר ולא הוסיף תגובה */}
            {userId && !comments.some(comment => comment.user === parseInt(userId)) && (
                <div className="add-comment-section">
                    <h2>Add a Comment</h2>
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your comment here"
                    ></textarea>
                    <button onClick={handleAddComment}>Add Comment</button>
                </div>
            )}
        </div>
    );
};

export default EventDetail;