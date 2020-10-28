import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Popup } from 'semantic-ui-react';

function LikeButton({ user, post: { id, likeCount, likes } }) {
	const [ liked, setLiked ] = useState(false);

	useEffect(
		() => {
			if (user && likes.find((like) => like.username === user.username)) {
				setLiked(true);
			} else setLiked(false);
		},
		[ user, likes ]
	);

	const [ likePost ] = useMutation(LIKE_POST_MUTATION, {
		variables: { postId: id }
	});

	const likeButton = user ? liked ? (
		<div className="ui teal button" onClick={likePost}>
			<i className="heart icon" />
		</div>
	) : (
		<div className="ui basic teal button" onClick={likePost}>
			<i className="heart icon" />
		</div>
	) : (
		<Link className="ui basic teal button" to="/login">
			<i className="heart icon" />
		</Link>
	);

	return (
		<Popup
			content={liked ? 'Unlike' : 'Like'}
			inverted
			trigger={
				<div className="ui labeled button">
					{likeButton}
					<div className="ui basic teal left pointing label">{likeCount}</div>
				</div>
			}
		/>
	);
}

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likeCount
		}
	}
`;

export default LikeButton;
