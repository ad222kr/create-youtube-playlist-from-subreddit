import React, { PropTypes } from "react"
import { Header, Navigation, Icon } from "react-mdl"
import github from "../images/github.png"

const AppHeader = ({ title }) => (
  <Header title={title}>
  </Header>
)



AppHeader.propTypes = {
  title: PropTypes.string.isRequired
}
export default AppHeader
