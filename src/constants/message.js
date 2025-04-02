export const InfoPersonalMess = {
  NAME_REQUIRED: 'Tên không được để trống',
  PHONENUMBER_INVALID: 'Số điện thoại không hợp lệ',
  ADDRESS_REQUIRED: 'Địa chỉ không được để trống',
  BIRTHDAY_INVALID: 'Ngày sinh không hợp lệ',
  SEX_REQUIRED: 'Giới tính phải là Nam(1) hoặc Nữ(0)',
  EMAIL_INVALID: 'Email không hợp lệ',
  EMAIL_EXITS: 'Email đã tồn tại',
};

export const CustomerMess = {
  ...InfoPersonalMess,
  IDSTAFF_REQUIRED: 'Yêu cầu mã nhân viên',
  ID_NOT_EXITS: 'Mã khách hàng không tồn tại',
  CMND_INVALID: 'CMND không hợp lệ',
  CMND_EXITS: 'CMND đã tồn tại',
  STATUS_INVALID: 'Trạng thái không hợp lệ',
  TYPE_INVALID: 'Loại khách hàng không hợp lệ',
};

export const RealEstateMess = {
  IDTYPE_INVALID: 'Loại BDS không hợp lệ',
  ADDRESS_REQUIRED: 'Địa chỉ không được để trống',
  PRICE_INVALID: 'Giá không hợp lệ',
  SIZE_INVALID: 'Kích thước không hợp lệ',
};
