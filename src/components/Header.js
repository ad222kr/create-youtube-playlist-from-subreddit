import React, { PropTypes } from "react"
import { Header } from "react-mdl"

const AppHeader = ({ title }) => (
  <Header title={title}>
  </Header>
)



AppHeader.propTypes = {
  title: PropTypes.string.isRequired
}
export default AppHeader
