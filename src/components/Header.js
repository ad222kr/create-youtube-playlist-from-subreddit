import React, { PropTypes } from "react"
import logo from '../images/logo.svg'

const Header = ({ title }) => {
  return (
    <div className="header flex-item">
      <h2>{title}</h2>
    </div>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired
}
export default Header
