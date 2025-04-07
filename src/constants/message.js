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
  ID_NOT_EXIST: 'Mã BDS không tồn tại',
  ADDRESS_REQUIRED: 'Địa chỉ không được để trống',
  STATUS_INVALID: 'Tình trạng không hợp lệ',
  ASSET_CODE: 'MSQSDD không hợp lệ',
  ASSET_CODE_EXIST: 'MSQSQD đã tồn tại',
  PRICE_INVALID: 'Giá không hợp lệ',
  SIZE_INVALID: 'Kích thước không hợp lệ',
  ROSES_INVALID: 'Huê hồng không hợp lệ',
};
export const ContractMess = {
  KGID_NOT_EXIST: 'Hợp đồng kí gửi không tồn tại',
  DCID_NOT_EXIST: 'Hợp đồng đặt cọc không tồn tại',
  STATUS_INVALID: 'Trạng thái hợp đồng không hợp lệ',
  CONDITION_INVALID: 'Tình trạng hợp đồng không hợp lệ',
  VALUE_INVALID: 'Giá trị không hợp lệ',
  COST_INVALID: 'Chi phí dịch vụ không hợp lệ',
  DATE_INVALID: 'Ngày không hợp lệ',
  CANCEL_SUCCESSED: 'Huỷ hợp đồng thành công',
};
