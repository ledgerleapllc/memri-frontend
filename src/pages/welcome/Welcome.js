import { Button } from '@shared/partials';
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div data-aos="fade-up" data-aos-duration="800" className="w-500px">
      <div className="w-full items-center flex flex-col">
        <h2 className="text-center capitalize font-normal text-primary mb-4">Get Started</h2>
        <span className="text-gray2 text-base font-light">Sign in if you already have an account or register if you’re a new user.</span>
        <div className='mt-12 flex gap-5'>
          <Button as={Link} to="/login" className="!w-1" color="primary" variant="outline">Sign In</Button>
          <Button as={Link} to="/register" className="!w-1" color="primary">Register</Button>
        </div>
      </div>
    </div>
  )
}

export default Welcome;