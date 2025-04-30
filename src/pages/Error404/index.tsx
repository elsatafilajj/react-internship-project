import { Link } from 'react-router-dom';

import { DangerIcon } from '@/assets/icons/general/Danger';
import error404 from '@/assets/images/error404.png';

export const Error404 = () => {
  return (
    <div className="main-wrapper error-wrapper">
      <div className="error-box">
        <img className="img-fluid" src={error404} alt="Error 404 image" />
        <h3>
          <DangerIcon className="danger-icon" />
          Service Unavailable
        </h3>
        <p>You may have mistyped the address or the page may have moved.</p>
        <Link to="/" className="btn btn-primary go-home">
          Back to Home
        </Link>
      </div>
    </div>
  );
};
