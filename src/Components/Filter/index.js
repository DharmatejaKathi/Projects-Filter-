import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectItem from '../ProjectItem'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStateConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Filter extends Component {
  state = {
    projectsList: [],
    activeId: categoriesList[0].id,
    apiStatus: apiStateConstants.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStateConstants.inProgress})
    const {activeId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updateData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updateData,
        apiStatus: apiStateConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStateConstants.failure})
    }
  }

  onChangeProject = event => {
    this.setState({activeId: event.target.value}, this.getProjects)
  }

  renderProjectItems = () => {
    const {projectsList} = this.state
    return (
      <ul className="ul">
        {projectsList.map(each => (
          <ProjectItem itemDetails={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderHeader = () => (
    <div className="header-container">
      <img
        className="logo"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
        alt="website logo"
      />
    </div>
  )

  renderDropDown = () => {
    const {activeId} = this.state
    return (
      <ul>
        <select
          value={activeId}
          onChange={this.onChangeProject}
          className="select"
        >
          {categoriesList.map(each => (
            <option value={each.id} key={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
      </ul>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getProjects}>
        Retry
      </button>
    </div>
  )

  finalRender = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStateConstants.success:
        return this.renderProjectItems()
      case apiStateConstants.inProgress:
        return this.renderLoader()
      case apiStateConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="container">
        {this.renderHeader()}
        {this.renderDropDown()}
        {this.finalRender()}
      </div>
    )
  }
}

export default Filter
