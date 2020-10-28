import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function MenuBar() {
	const { user, logout } = useContext(AuthContext);
	const [ activeItem, setActiveItem ] = useState();

	const handleItemClick = (e) => {
		if (activeItem != null) activeItem.classList.remove('active');
		e.target.classList.add('active');
		setActiveItem(e.target);
	};

	useEffect(() => {
		const pathname = window.location.pathname;
		const path = pathname === '/' ? 'home' : pathname.substr(1);
		const id = 'menu_link_' + path;
		let element = document.getElementById(id);
		if (!element) element = document.getElementById('menu_link_home');
		setActiveItem(element);
		element.classList.add('active');
	}, []);

	const menuBar = user ? (
		<React.Fragment>
			<div id="menu_link_home" className="ui secondary pointing menu teal">
				<Link className="ui item active" to="/">
					{user.username}
				</Link>
				<div className="right menu">
					<div id="menu_link_logout" className="ui item" style={{ cursor: 'pointer' }} onClick={logout}>
						Log out
					</div>
				</div>
			</div>
		</React.Fragment>
	) : (
		<React.Fragment>
			<div className="ui secondary pointing menu teal">
				<Link id="menu_link_home" className="ui item" to="/" onClick={handleItemClick}>
					Home
				</Link>
				<div className="right menu">
					<Link id="menu_link_login" className="ui item" to="/login" onClick={handleItemClick}>
						Log in
					</Link>
					<Link id="menu_link_register" className="ui item" to="/register" onClick={handleItemClick}>
						Register
					</Link>
				</div>
			</div>
		</React.Fragment>
	);

	return menuBar;
}
export default MenuBar;
