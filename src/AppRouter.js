// import PropTypes from 'prop-types'
import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Spinner } from './components/shared/Spinner'
import PrivateRoute from './PrivateRoute'
import { publicRoutes, privateRoutes } from './route'
const AppRouter = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <BrowserRouter>
        <Routes>
          {publicRoutes.map(({ element: Component, path, exact }) => (
            <Route
              path={path}
              key={path}
              exact={exact}
              element={<Component />}
            />
          ))}
          {privateRoutes.map(({ element: Component, path, exact }) => (
            <Route key={path} element={<PrivateRoute />}>
              <Route path={path} exact={exact} element={<Component />} />
            </Route>
          ))}
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

// AppRouter.propTypes = {
//   second: PropTypes.third
// }

// const mapStateToProps = (state) => ({})

// const mapDispatchToProps = {}

// export default connect(mapStateToProps, mapDispatchToProps)(AppRouter)
export default AppRouter