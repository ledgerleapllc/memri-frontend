import { Button } from '@shared/partials';
import { Link } from "react-router-dom";

const SignUpWelcome = () => {
  return (
    <div data-aos="fade-up" data-aos-duration="800" className="w-500px">
      <div className="w-full items-center flex flex-col text-center">
        <h2 className="text-center capitalize font-normal text-primary mb-4">Registration</h2>
        <span className="text-gray2 text-base font-light">Thank you for your interest in the DEVxDAO. Please fill out the form to register and create an account.</span>
        <div className='mt-12 flex flex-col gap-5 items-center'>
          <Button as={Link} to="/register/form" className="!w-1 whitespace-nowrap" color="primary">Begin Registration</Button>
          <span className="text-gray2 text-base font-light">
            Already have an account?
            <Link to="/login" className="pl-2 underline text-primary">Sign In</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default SignUpWelcome;