import { toast } from 'react-toastify';
// Helper function to format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export const getRoleName = (quyen) => {
  return quyen === 0 ? 'Admin' : 'Nhân viên';
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
export function handleAxiosError(error) {
  if (error.response?.status === 422) {
    const { message, errors } = error.response.data;
    return {
      status: 422,
      payload: { message, errors },
    };
  } else {
    const data = error.response?.data;
    const message = data?.message || error.message || 'Entity Error';
    const status = error.response?.status || 500;

    return {
      status,
      payload: data || {},
      message,
    };
  }
}
export const handleError = ({ error, setError, duration }) => {
  if (error.isAxiosError) {
    const handledError = handleAxiosError(error);
    if (handledError.status === 422 || handledError.status === 401) {
      const { message, errors } = handledError.payload;
      if (setError && errors) {
        if (Object.keys(errors).length > 0) {
          for (const field in errors) {
            setError(field, {
              type: 'server',
              message: errors[field],
            });
          }
        } else {
          toast.error(message || 'Something went wrong', {
            autoClose: duration ?? 5000,
          });
        }
        return;
      } else {
        toast.error(message || 'Something went wrong', {
          autoClose: duration ?? 5000,
        });
      }
    } else {
      toast.error(handledError.message || 'Something went wrong', {
        autoClose: duration ?? 5000,
      });
    }
  } else {
    toast.error(error?.message ?? 'Something went wrong', {
      autoClose: duration ?? 5000,
    });
  }
};
