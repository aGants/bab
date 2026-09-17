import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'

const CheckIn = () => {
  return (
    <div>
      <h1>Check-in</h1>
      <Link to={ROUTES.words}>Body word cards →</Link>
    </div>
  )
}

export default CheckIn
