import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
	const { user } = useContext(AuthContext);
	const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS_QUERY);

	return (
		<div className="ui grid">
			<div className="row">
				<p className="page-title">Recent Posts</p>
			</div>
			<div className="ui cards" style={{ justifyContent: 'space-between' }}>
				{user && (
					<div className="column">
						<PostForm />
					</div>
				)}
				{loading ? (
					<h1>Loading posts...</h1>
				) : (
					posts !== undefined && posts.map((post) => <PostCard key={post.id} post={post} />)
				)}
			</div>
		</div>
	);
}

export default Home;
