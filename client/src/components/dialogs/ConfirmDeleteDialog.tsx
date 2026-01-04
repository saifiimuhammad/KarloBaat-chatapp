import { type FC } from "react";

type ConfirmDeleteDialogProps = {
  open: boolean;
  handleClose: () => void;
  deleteHandler: () => void;
};

const ConfirmDeleteDialog: FC<ConfirmDeleteDialogProps> = ({
  open,
  handleClose,
  deleteHandler,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-text">Confirm Delete</h2>

        <p className="mt-3 text-sm text-text-light">
          Are you sure you want to delete this group?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={deleteHandler}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteDialog;
