// import PropTypes from 'prop-types'
import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Spinner } from './components/shared/Spinner'
import { publicRoutes, protectedRoutes, privateRoutes } from './route'
import { useAuthData, useUserData } from './AuthContext'
import { constants } from './constants'

// import PropTypes from 'prop-types'
const AppRouter = () => {
  const { currentUser } = useAuthData();
  const { userData } = useUserData();
  const isAuthorized = currentUser && ((currentUser.emailVerified) || (currentUser.phoneNumber && currentUser.providerData.length && currentUser.providerData[0].providerId === 'phone'))
  const userRole = isAuthorized && userData && userData.role
  const accessType = userRole === '0' ? constants.EMPLOYEE_KEYWORD : userRole === '1' ? constants.EMPLOYER_KEYWORD : userRole === '2' ? constants.ADMIN_KEYWORD : ''
  const isActiveFalse = userData && !userData.active
  return (
    <Suspense fallback={<Spinner />}>
      <BrowserRouter>
        <Routes>
          {publicRoutes.map(({ element: Component, path, exact }) => (
            <Route
              path={path}
              key={path}
              exact={exact}
              element={isAuthorized ?
                <Navigate
                  to={
                    accessType === constants.EMPLOYEE_KEYWORD && !isActiveFalse ? "/user-profile"
                      : accessType === constants.EMPLOYER_KEYWORD && !isActiveFalse ? '/home'
                        : accessType === constants.ADMIN_KEYWORD && !isActiveFalse ? '/admin-dashboard'
                          : '/user-details'
                  }
                /> :
                <Component />
              }
            />
          ))}

          {protectedRoutes.map(({ element: Component, path, exact, accessControls }) => (
            <Route key={path} element={<ProtectedRoute
              isAuthorized={isAuthorized}
              isActiveFalse={isActiveFalse}
            />}>
              <Route
                key={path}
                path={path}
                exact={exact}
                element={
                  <Component />
                }
              />
            </Route>
          ))}
          {privateRoutes.map(({ element: Component, path, exact, accessControls }) => (
            <Route key={path} element={<PrivateRoute
              isAuthorized={isAuthorized}
              isActiveTrue={!isActiveFalse}
            />}>
              <Route
                path={path}
                exact={exact}
                element={
                  accessControls.includes(accessType) ? <Component />
                    : <Navigate to='/' />
                }
              />
            </Route>
          ))}
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

const ProtectedRoute = (props) => {
  const { isAuthorized, isActiveFalse } = props
  const location = useLocation();
  return isAuthorized && isActiveFalse ? (
    <Outlet />
  ) : (
    <Navigate
      to={`/${location.search}`}
      replace
      state={{ location }}
    />
  )
};

const PrivateRoute = (props) => {
  const { isAuthorized, isActiveTrue } = props
  const location = useLocation();
  return isAuthorized && isActiveTrue ? (
    <Outlet />
  ) : (
    <Navigate
      to={`/${location.search}`}
      replace
      state={{ location }}
    />
  )
};
export default AppRouter