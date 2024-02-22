import './index.css'

const ProjectItem = props => {
  const {itemDetails} = props
  const {imageUrl, name} = itemDetails
  return (
    <li className="li">
      <img className="img" src={imageUrl} alt={name} />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectItem
