import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {
	const { values, onChange, onSubmit } = useForm(createPostCallBack, {
		body: ''
	});

	const [ error, setError ] = useState(null);

	// only one error possible
	const [ createPost, { loading } ] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update(proxy, result) {
			setError(null);
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY
			});
			let newData = [ ...data.getPosts ];
			newData.getPosts = [ result.data.createPost, ...newData ];
			proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { ...data, getPosts: { newData } } });
			values.body = '';
		},
		onError(err) {
			console.log(err.graphQLErrors[0]);
			setError(err.graphQLErrors[0]);
		}
	});

	function createPostCallBack() {
		createPost();
	}

	return (
		<div style={{ margin: '1vh', marginLeft: '2vh' }}>
			<form className={`ui form ${loading ? 'loading' : ''}`} onSubmit={onSubmit} noValidate>
				<h2>Create a post:</h2>
				<div className="field">
					<input
						type="text"
						name="body"
						placeholder="Hi World!"
						onChange={onChange}
						value={values.body}
						size="34"
						error={error ? 'true' : 'false'}
					/>
				</div>
				<button className="ui button teal" type="submit">
					Submit
				</button>
			</form>
			{error && (
				<div className="ui error message">
					<ul className="list">
						<li>{error.message}</li>
					</ul>
				</div>
			)}
		</div>
	);
}

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			username
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				body
				username
				createdAt
			}
			commentCount
		}
	}
`;

export default PostForm;
