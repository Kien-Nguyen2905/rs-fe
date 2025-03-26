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
