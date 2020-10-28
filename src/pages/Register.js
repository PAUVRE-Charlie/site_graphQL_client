import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Register(props) {
	const context = useContext(AuthContext);
	const [ errors, setErrors ] = useState({});

	const { onChange, onSubmit, values } = useForm(registerUser, {
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	const [ addUser, { loading } ] = useMutation(REGISTER_USER, {
		update(_, { data: { register: userData } }) {
			console.log(userData);
			context.login(userData);
			props.history.push('/');
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values
	});

	function registerUser() {
		addUser();
	}

	return (
		<div style={{ width: '30rem', margin: 'auto' }}>
			<p className="page-title">Register</p>
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
					<label>Email Adress</label>
					<input
						type="email"
						name="email"
						placeholder="Enter your email adress"
						onChange={onChange}
						value={values.email}
						error={errors.email ? 'true' : 'false'}
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
				<div className="field">
					<label>Confirm Password</label>
					<input
						placeholder="Confirm Password.."
						name="confirmPassword"
						type="password"
						value={values.confirmPassword}
						error={errors.confirmPassword ? 'true' : 'false'}
						onChange={onChange}
					/>
				</div>
				<button className="ui button teal" type="submit">
					Submit
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

const REGISTER_USER = gql`
	mutation register($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
		register(
			registerInput: {
				username: $username
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Register;
