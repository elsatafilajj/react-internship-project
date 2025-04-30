import { Link } from 'react-router-dom';

import danger from '@/assets/images/danger.png';

interface ConfirmDeleteModalProps {
  id: string;
  title?: string;
  message?: string;
  onDelete: () => void;
}

export const ConfirmDeleteModal = ({
  id,
  title,
  message,
  onDelete,
}: ConfirmDeleteModalProps) => {
  return (
    <div id={id} className="modal fade delete-modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body text-center">
            <img src={danger} alt="Warning" width={50} height={46} />
            <h3>{title || 'Are you sure you want to delete this?'}</h3>
            {message && <p>{message}</p>}
            <div className="m-t-20">
              <Link
                to="#"
                className="btn btn-white me-2"
                data-bs-dismiss="modal"
              >
                Close
              </Link>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onDelete}
                data-bs-dismiss="modal"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
