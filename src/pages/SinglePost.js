import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import { Popup } from 'semantic-ui-react';

function SinglePost(props) {
	const postId = props.match.params.postId;
	const { user } = useContext(AuthContext);

	const commentInputRef = useRef(null);

	const [ comment, setComment ] = useState('');

	const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId
		}
	});

	const [ onSubmitComment ] = useMutation(SUBMIT_COMMENT_MUTATION, {
		update() {
			setComment('');
			commentInputRef.current.blur();
		},
		variables: {
			postId,
			body: comment
		}
	});

	function deletePostCallback() {
		props.history.push('/');
	}

	let postMarkup;
	if (!getPost) {
		postMarkup = <p>Loading post...</p>;
	} else {
		const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = getPost;

		postMarkup = (
			<div className="ui flex">
				<div className="column">
					<div className="two wide column">
						<img
							className="left floated small ui image"
							src="https://semantic-ui.com/images/avatar/large/elliot.jpg"
							alt="avatar"
						/>
					</div>
				</div>
				<div className="column">
					<div className="ui cards">
						<div className="ui fluid card">
							<div
								className="content"
								style={{
									display: 'flex',
									flexDirection: 'column'
								}}
							>
								<div className="header">{username}</div>
								<div className="meta">{moment(createdAt).fromNow()}</div>
								<div
									className="description"
									style={{ marginTop: '1vh', marginBottom: '2vh', flex: '1' }}
								>
									<div>{body}</div>
								</div>
								<div className="extra content">
									<LikeButton user={user} post={{ id, likes, likeCount }} />
									<Popup
										content="Delete a post"
										inverted
										trigger={
											<div className="ui basic labeled button">
												<div className="ui basic green button">
													<i className="comments icon" />
												</div>
												<div className="ui basic left pointing green label">{commentCount}</div>
											</div>
										}
									/>
									{user &&
									user.username === username && (
										<DeleteButton postId={id} callback={deletePostCallback} />
									)}
								</div>
							</div>
						</div>
						{user && (
							<div className="ui fluid card">
								<div className="content">
									<p>Post a comment</p>
									<form className="ui form" onSubmit={(event) => event.preventDefault()} noValidate>
										<div className="ui action input fluid">
											<input
												type="text"
												name="comment"
												placeholder="Comment..."
												onChange={(event) => setComment(event.target.value)}
												value={comment}
												ref={commentInputRef}
											/>
											<button
												className="ui button teal"
												type="submit"
												disabled={comment.trim() === ''}
												onClick={onSubmitComment}
											>
												Submit
											</button>
										</div>
									</form>
								</div>
							</div>
						)}
						{comments.map((comment) => (
							<div className="ui fluid card" key={comment.id}>
								<div
									className="content"
									style={{
										display: 'flex',
										flexDirection: 'column'
									}}
								>
									{user &&
									user.username === comment.username && (
										<div style={{ position: 'absolute', right: '20px' }}>
											<DeleteButton postId={id} commentId={comment.id} />
										</div>
									)}
									<div className="header">{comment.username}</div>
									<div className="meta">{moment(comment.createdAt).fromNow()}</div>
									<div
										className="description"
										style={{ marginTop: '1vh', marginBottom: '2vh', flex: '1' }}
									>
										<div>{comment.body}</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
	return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
	mutation($postId: ID!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			comments {
				id
				body
				createdAt
				username
			}
			commentCount
		}
	}
`;

const FETCH_POST_QUERY = gql`
	query($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			createdAt
			username
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

export default SinglePost;
