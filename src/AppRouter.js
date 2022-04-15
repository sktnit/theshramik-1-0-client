// import PropTypes from 'prop-types'
import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
// import { connect } from 'react-redux'
const Welcome = React.lazy(() => import('./components/WelcomePage/Welcome'))
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={<Welcome />}
        >
        </Route>
      </Routes>
    </Router>
  )
}

// AppRouter.propTypes = {
//   second: PropTypes.third
// }

// const mapStateToProps = (state) => ({})

// const mapDispatchToProps = {}

// export default connect(mapStateToProps, mapDispatchToProps)(AppRouter)
export default AppRouter