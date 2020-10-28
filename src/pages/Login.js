import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Login(props) {
	const context = useContext(AuthContext);
	const [ errors, setErrors ] = useState({});

	const { onChange, onSubmit, values } = useForm(loginUserCallback, {
		username: '',
		password: ''
	});

	const [ loginUser, { loading } ] = useMutation(LOGIN_USER, {
		update(_, { data: { login: userData } }) {
			console.log(userData);
			context.login(userData);
			props.history.push('/');
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values
	});

	function loginUserCallback() {
		loginUser();
	}

	return (
		<div style={{ width: '30rem', margin: 'auto' }}>
			<p className="page-title">Log in</p>
			<form className={`ui form ${loading ? 'loading' : ''}`} onSubmit={onSubmit} noValidate>
				<div className="field">
					<label>Username</label>
					<input
						type="text"
						name="username"
						placeholder="Enter a username"
						onChange={onChange}
						value={values.username}
						error={errors.username ? 'true' : 'false'}
					/>
				</div>
				<div className="field">
					<label>Password</label>
					<input
						type="password"
						name="password"
						placeholder="Enter a password"
						onChange={onChange}
						value={values.password}
						error={errors.password ? 'true' : 'false'}
					/>
				</div>
				<button className="ui button teal" type="submit">
					Log in
				</button>
			</form>
			{Object.keys(errors).length > 0 && (
				<div className="ui error message">
					<ul className="list">{Object.values(errors).map((value) => <li key={value}>{value}</li>)}</ul>
				</div>
			)}
		</div>
	);
}

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Login;
