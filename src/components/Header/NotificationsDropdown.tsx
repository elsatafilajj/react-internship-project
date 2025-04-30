import { Link } from 'react-router-dom';

import { NotificationIcon } from '@/assets/icons/general/Notification';

export const NotificationsDropdown = () => {
  return (
    <li className="nav-item dropdown d-none d-sm-block">
      <Link
        to="#"
        className="dropdown-toggle nav-link"
        data-bs-toggle="dropdown"
      >
        <NotificationIcon height={25} width={25} />
        <span className="pulse" />
      </Link>
      <div className="dropdown-menu notifications">
        <div className="topnav-dropdown-header">
          <span>Notifications</span>
        </div>
        <div className="drop-scroll">
          <ul className="notification-list">
            <NotificationItem name="Richard Miller" time="13:13" />
            <NotificationItem name="Patek Philippe" time="13:13" />
          </ul>
        </div>
        <div className="topnav-dropdown-footer">
          <Link to="." onClick={(e) => e.preventDefault()}>
            View all Notifications
          </Link>
        </div>
      </div>
    </li>
  );
};

interface NotificationItemProps {
  name: string;
  time: string;
}

const NotificationItem = ({ name, time }: NotificationItemProps) => {
  return (
    <li className="notification-message">
      <Link to="." onClick={(e) => e.preventDefault()}>
        <div className="media">
          <span className="avatar">{name.charAt(0).toUpperCase()}</span>
          <div className="media-body">
            <p className="noti-details">
              <span className="noti-title">{name}</span> completed task{' '}
              <span className="noti-title">
                Patient and Doctor video conferencing
              </span>
            </p>
            <p className="noti-time">
              <span className="notification-time">{time}</span>
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};
