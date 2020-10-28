import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { Confirm } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';

function DeleteButton({ postId, commentId, callback }) {
	const [ confirmOpen, setConfirmOpen ] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [ deletePostOrComment ] = useMutation(mutation, {
		update(proxy, _) {
			setConfirmOpen(false);
			// remove post from cache
			if (!commentId) {
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY
				});
				data.getPosts = data.getPosts.filter((p) => p.id !== postId);
				proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
			}
			if (callback) callback();
		},
		variables: {
			postId,
			commentId
		}
	});

	return (
		<React.Fragment>
			<div className="ui red right floated button" onClick={() => setConfirmOpen(true)}>
				<i className="trash icon" style={{ margin: '0' }} />
			</div>
			<div>
				<Confirm onCancel={() => setConfirmOpen(false)} open={confirmOpen} onConfirm={deletePostOrComment} />
			</div>
		</React.Fragment>
	);
}

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
			commentCount
		}
	}
`;

export default DeleteButton;
