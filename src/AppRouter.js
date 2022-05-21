// import PropTypes from 'prop-types'
import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Spinner } from './components/shared/Spinner'
// import Welcome from './components/WelcomePage/Welcome'
const Welcome = React.lazy(() => import('./components/WelcomePage/Welcome'))
const AboutUs = React.lazy(() => import('./components/AboutUs/AboutUs'))
const Login = React.lazy(() => import('./components/Login/Login'))
const Register = React.lazy(() => import('./components/Register/Register'))
const AppRouter = () => {
  return (
    <Suspense fallback={<Spinner/>}>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<Welcome />}
          />
          <Route
            path='about'
            element={<AboutUs />}
          />
          <Route
            path='login'
            element={<Login />}
          />
          <Route
            path='register'
            element={<Register />}
          />
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