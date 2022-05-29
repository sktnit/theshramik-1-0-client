import React from 'react'
import { Navigate, Outlet, useLocation } from "react-router-dom"
// import PropTypes from 'prop-types'
import { useConsumer } from './AuthContext';

const PrivateRoute = () => {
	const { currentUser } = useConsumer();
	const isAuthorized = currentUser && currentUser.emailVerified
	const location = useLocation();
	return isAuthorized ? (
		<Outlet />
	) : (
		<Navigate
			to={`/${location.search}`}
			replace
			state={{ location }}
		/>
	)
};

PrivateRoute.propTypes = {}

export default PrivateRoute
