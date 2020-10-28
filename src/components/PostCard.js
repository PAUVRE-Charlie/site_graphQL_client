import React, { useContext } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import { Popup } from 'semantic-ui-react';

function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes } }) {
	const { user } = useContext(AuthContext);

	return (
		<div className="card">
			<div
				className="content"
				style={{
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				<img
					className="right floated mini ui image"
					src="https://semantic-ui.com/images/avatar/large/elliot.jpg"
					alt="avatar"
					style={{ position: 'absolute', right: '20px', top: '20px' }}
				/>
				<div className="header">{username}</div>
				<div className="meta">{moment(createdAt).fromNow()}</div>
				<div className="description" style={{ marginTop: '1vh', marginBottom: '2vh', flex: '1' }}>
					<p>{body}</p>
				</div>
				<div className="extra content">
					<LikeButton user={user} post={{ id, likes, likeCount }} />
					<Popup
						content="Comment on post"
						inverted
						trigger={
							<Link className="ui basic labeled button" to={`/posts/${id}`}>
								<div className="ui basic green button">
									<i className="comments icon" />
								</div>
								<div className="ui basic left pointing green label">{commentCount}</div>
							</Link>
						}
					/>
					{user && user.username === username && <DeleteButton postId={id} />}
				</div>
			</div>
		</div>
	);
}

export default PostCard;
